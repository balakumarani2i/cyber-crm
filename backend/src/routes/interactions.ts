import express from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = express.Router();

const interactionSchema = z.object({
  customerId: z.string(),
  type: z.enum(['CALL', 'EMAIL', 'MEETING', 'NOTE']),
  subject: z.string().min(1),
  description: z.string().optional(),
  date: z.string()
});

router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { customerId } = req.query;
  const where = customerId ? { customerId: customerId as string } : {};
  
  const interactions = await prisma.interaction.findMany({
    where,
    include: {
      customer: { select: { name: true } },
      user: { select: { name: true } }
    },
    orderBy: { date: 'desc' }
  });
  
  res.json({
    success: true,
    data: interactions,
    count: interactions.length
  });
}));

router.post('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const data = interactionSchema.parse(req.body);
  const interaction = await prisma.interaction.create({
    data: {
      ...data,
      date: new Date(data.date),
      userId: req.user!.id
    },
    include: {
      customer: { select: { name: true } },
      user: { select: { name: true } }
    }
  });
  
  res.status(201).json({
    success: true,
    message: 'Interaction created successfully',
    data: interaction
  });
}));

export default router;