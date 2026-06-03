import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { prisma } from '../../config/db';
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});
export const processAndStoreDocument = async (
  text: string, 
  documentId: string, 
  projectId: string
): Promise<void> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.createDocuments([text]);
  for (const chunk of chunks) {
    const content = chunk.pageContent;
    const vector = await embeddings.embedQuery(content);
    const vectorString = JSON.stringify(vector); 
    await prisma.$executeRaw`
      INSERT INTO "DocumentChunk" ("id", "documentId", "projectId", "content", "embedding", "createdAt")
      VALUES (
        gen_random_uuid(), 
        ${documentId}, 
        ${projectId}, 
        ${content}, 
        ${vectorString}::text::vector, 
        NOW()
      )
    `;
  }
};