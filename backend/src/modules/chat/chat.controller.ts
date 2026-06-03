import { Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import { answerQuestion } from './chat.service';
export const askQuestion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { query } = req.body;
    const userId = req.user!.userId;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }
    const project = await prisma.project.findFirst({ 
      where: { id: String(projectId), userId } 
    });
    
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
     const result = await answerQuestion(query, String(projectId));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const submitFeedback = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { query, answer, isHelpful } = req.body;
    const userId = req.user!.userId;
    const project = await prisma.project.findFirst({ 
      where: { id: String(projectId), userId } 
    });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const feedback = await prisma.feedback.create({
      data: { 
        query, 
        answer, 
        isHelpful, 
        projectId: String(projectId) 
      }
    });
    res.status(201).json({ message: 'Feedback recorded', feedback });
  } catch (error) {
    next(error);
  }
};
export const getFeedbackStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectId } = req.params;
    const userId = req.user!.userId;
    const project = await prisma.project.findFirst({ 
      where: { id: String(projectId), userId } 
    });   
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const totalFeedback = await prisma.feedback.count({ 
      where: { projectId: String(projectId) } 
    });
   const helpfulCount = await prisma.feedback.count({ 
      where: { projectId: String(projectId), isHelpful: true } 
    });  
    const notHelpfulCount = totalFeedback - helpfulCount;
    res.status(200).json({
      projectId,
      totalFeedback,
      helpfulCount,
      notHelpfulCount,
      helpfulPercentage: totalFeedback > 0 ? ((helpfulCount / totalFeedback) * 100).toFixed(2) + '%' : '0%'
    });
  } catch (error) {
    next(error);
  }
};