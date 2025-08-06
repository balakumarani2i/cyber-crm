import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'SALES', 'MANAGER']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Register
router.post('/register', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { name, email, password, role } = registerSchema.parse(req.body);
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('User already exists', 409, 'An account with this email already exists. Please use a different email or try logging in.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'SALES'
    },
    select: { id: true, name: true, email: true, role: true }
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );

  res.status(201).json({ 
    success: true,
    message: 'Account created successfully',
    user, 
    token 
  });
}));

// Login
router.post('/login', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { email, password } = loginSchema.parse(req.body);
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid credentials', 401, 'Invalid email or password. Please check your credentials and try again.');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401, 'Invalid email or password. Please check your credentials and try again.');
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );

  const { password: _, ...userWithoutPassword } = user;
  res.json({ 
    success: true,
    message: 'Login successful',
    user: userWithoutPassword, 
    token 
  });
}));

export default router;