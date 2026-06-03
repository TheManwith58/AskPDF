
const pdfParse = require('pdf-parse');
export const extractTextFromBuffer = async (buffer: Buffer, mimetype: string): Promise<string> => {
  if (mimetype === 'application/pdf') {
    const pdfData = await pdfParse(buffer);
    return pdfData.text;
  } 
  
  if (mimetype === 'text/plain') {
    return buffer.toString('utf-8');
  }

  throw new Error('Unsupported file type');
};