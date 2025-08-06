import express from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = express.Router();

const dealSchema = z.object({
  customerId: z.string(),
  title: z.string().min(1),
  value: z.number().optional(),
  stage: z.enum(['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']).optional(),
  probability: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.string().optional()
});

router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const deals = await prisma.deal.findMany({
    include: {
      customer: { select: { name: true, company: true } },
      assignedUser: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  res.json({
    success: true,
    data: deals,
    count: deals.length
  });
}));

router.post('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const data = dealSchema.parse(req.body);
  const deal = await prisma.deal.create({
    data: {
      ...data,
      expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : null,
      assignedTo: req.user!.id
    },
    include: {
      customer: { select: { name: true, company: true } },
      assignedUser: { select: { name: true } }
    }
  });
  
  res.status(201).json({
    success: true,
    message: 'Deal created successfully',
    data: deal
  });
}));

router.put('/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const data = dealSchema.partial().parse(req.body);
  const deal = await prisma.deal.update({
    where: { id: req.params.id },
    data: {
      ...data,
      expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : undefined
    },
    include: {
      customer: { select: { name: true, company: true } },
      assignedUser: { select: { name: true } }
    }
  });
  
  res.json({
    success: true,
    message: 'Deal updated successfully',
    data: deal
  });
}));

export default router;