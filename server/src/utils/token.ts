import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function generateTokens(userId: number) {
  const accessToken = jwt.sign({ userId }, env.jwtSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, env.jwtRefreshSecret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwtRefreshSecret) as { userId: number };
}
