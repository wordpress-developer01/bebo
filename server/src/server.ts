import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.js';
import { productRouter } from './routes/products.js';
import { adminRouter } from './routes/admin.js';
import { orderRouter } from './routes/orders.js';
import { summarizeCart } from './controllers/orderController.js';
import { authenticate } from './middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many login attempts, please try again later.'
  });

  app.use('/api/auth/login', loginLimiter);

  app.use('/api/auth', authRouter);
  app.use('/api/products', productRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/admin', adminRouter);
  app.post('/api/cart', authenticate(true), summarizeCart);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
  app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets')));

  app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}
