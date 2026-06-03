import { Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import { extractTextFromBuffer } from './document.service';
import { processAndStoreDocument } from './vector.service';
export const uploadFile = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const file = req.file;
    const userId = req.user!.userId;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const project = await prisma.project.findFirst({ 
      where: { 
        id: String(projectId), 
        userId 
      } 
    }); 
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const document = await prisma.document.create({
      data: {
        filename: file.originalname,
        projectId: String(projectId),
      },
    });
    const rawText = await extractTextFromBuffer(file.buffer, file.mimetype);
    await processAndStoreDocument(rawText, document.id, String(projectId));
    res.status(201).json({ message: 'Document uploaded successfully', document });
  } catch (error) {
    next(error);
  }
};