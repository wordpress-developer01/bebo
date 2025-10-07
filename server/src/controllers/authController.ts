import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { generateTokens, verifyRefreshToken } from '../utils/token.js';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});

export async function register(req: Request, res: Response) {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid data', errors: parse.error.flatten() });
  }

  const { email, password, name } = parse.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, name, passwordHash } });
  const tokens = generateTokens(user.id);
  return res.status(201).json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    ...tokens
  });
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function login(req: Request, res: Response) {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const { email, password } = parse.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const tokens = generateTokens(user.id);
  return res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    ...tokens
  });
}

const refreshSchema = z.object({ refreshToken: z.string() });

export async function refresh(req: Request, res: Response) {
  const parse = refreshSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid token' });
  }
  try {
    const payload = verifyRefreshToken(parse.data.refreshToken);
    const tokens = generateTokens(payload.userId);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true }
    });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.json({ user, ...tokens });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
