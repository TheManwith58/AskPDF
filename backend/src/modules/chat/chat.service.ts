import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { prisma } from '../../config/db';
const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: 'gpt-3.5-turbo' });
export const performHybridSearch = async (query: string, projectId: string, limit: number = 5) => {
  const queryVector = await embeddings.embedQuery(query);
  const vectorString = `[${queryVector.join(',')}]`;
  const searchResults = await prisma.$queryRaw`
    WITH semantic_search AS (
      SELECT id, content, 1 - (embedding <=> ${vectorString}::text::vector) AS semantic_score
      FROM "DocumentChunk" WHERE "projectId" = ${projectId}
    ),
    keyword_search AS (
      SELECT id::text, content, ts_rank(to_tsvector('english', content), plainto_tsquery('english', ${query})) AS keyword_score
      FROM "DocumentChunk" WHERE "projectId" = ${projectId}
    )
    SELECT s.id, s.content, (s.semantic_score * 0.7) + (COALESCE(k.keyword_score, 0) * 0.3) AS final_score
    FROM semantic_search s
    LEFT JOIN keyword_search k ON s.id = k.id
    ORDER BY final_score DESC
    LIMIT ${limit};
  ` as { id: string; content: string; final_score: number }[];
  return searchResults;
};
export const answerQuestion = async (query: string, projectId: string) => {
  const contextChunks = await performHybridSearch(query, projectId);
  if (!contextChunks || contextChunks.length === 0) {
    return { answer: "I couldn't find any relevant information in this project to answer your question.", sources: [] };
  }
  const contextText = contextChunks.map((chunk, index) => `[Source ${index + 1}]: ${chunk.content}`).join('\n\n');
  const prompt = PromptTemplate.fromTemplate(`
    You are a helpful assistant. Use the following pieces of retrieved context to answer the question. 
    If you don't know the answer based on the context, just say that you don't know. 
    Do not hallucinate or make up information.

    Context:
    {context}

    Question: {question}
    Answer:
  `);

  const formattedPrompt = await prompt.format({ context: contextText, question: query });
  const response = await llm.invoke(formattedPrompt);
  return {
    answer: response.content,
    sources: contextChunks.map(chunk => chunk.content)
  };
};