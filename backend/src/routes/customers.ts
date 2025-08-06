import express from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = express.Router();

const customerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PROSPECT']).optional()
});

// Get all customers
router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const customers = await prisma.customer.findMany({
    include: {
      assignedUser: { select: { id: true, name: true, email: true } },
      _count: { select: { deals: true, interactions: true, tasks: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  res.json({
    success: true,
    data: customers,
    count: customers.length
  });
}));

// Get customer by ID
router.get('/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const customer = await prisma.customer.findUnique({
    where: { id: req.params.id },
    include: {
      assignedUser: { select: { id: true, name: true, email: true } },
      interactions: {
        include: { user: { select: { name: true } } },
        orderBy: { date: 'desc' }
      },
      deals: { orderBy: { createdAt: 'desc' } },
      tasks: {
        include: { assignedUser: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!customer) {
    throw new AppError('Customer not found', 404, 'The requested customer could not be found. It may have been deleted or you may not have permission to view it.');
  }

  res.json({
    success: true,
    data: customer
  });
}));

// Create customer
router.post('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const data = customerSchema.parse(req.body);
  
  const customer = await prisma.customer.create({
    data: {
      ...data,
      assignedTo: req.user!.id
    },
    include: {
      assignedUser: { select: { id: true, name: true, email: true } }
    }
  });

  res.status(201).json({
    success: true,
    message: 'Customer created successfully',
    data: customer
  });
}));

// Update customer
router.put('/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const data = customerSchema.partial().parse(req.body);
  
  const customer = await prisma.customer.update({
    where: { id: req.params.id },
    data,
    include: {
      assignedUser: { select: { id: true, name: true, email: true } }
    }
  });

  res.json({
    success: true,
    message: 'Customer updated successfully',
    data: customer
  });
}));

// Delete customer
router.delete('/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  await prisma.customer.delete({
    where: { id: req.params.id }
  });
  
  res.json({
    success: true,
    message: 'Customer deleted successfully'
  });
}));

export default router;