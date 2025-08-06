import express from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = express.Router();

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  customerId: z.string().optional(),
  dealId: z.string().optional()
});

router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const tasks = await prisma.task.findMany({
    where: { assignedTo: req.user!.id },
    include: {
      customer: { select: { name: true } },
      deal: { select: { title: true } }
    },
    orderBy: { dueDate: 'asc' }
  });
  
  res.json({
    success: true,
    data: tasks,
    count: tasks.length
  });
}));

router.post('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const data = taskSchema.parse(req.body);
  const task = await prisma.task.create({
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assignedTo: req.user!.id
    },
    include: {
      customer: { select: { name: true } },
      deal: { select: { title: true } }
    }
  });
  
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task
  });
}));

router.put('/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const data = taskSchema.partial().parse(req.body);
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined
    }
  });
  
  res.json({
    success: true,
    message: 'Task updated successfully',
    data: task
  });
}));

export default router;