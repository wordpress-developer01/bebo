import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';

export interface AuthRequest extends Request {
  user?: { id: number; role: 'USER' | 'ADMIN' };
}

export function authenticate(required = true) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      if (required) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      return next();
    }

    const token = header.split(' ')[1];
    try {
      const payload = jwt.verify(token, env.jwtSecret) as { userId: number };
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, role: true }
      });
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = { id: user.id, role: user.role };
      next();
    } catch (err) {
      if (required) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();
    }
  };
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}
