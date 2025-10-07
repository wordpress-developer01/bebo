import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { createOrder, listOrders, summarizeCart } from '../controllers/orderController.js';

export const orderRouter = Router();

orderRouter.post('/cart', authenticate(true), summarizeCart);
orderRouter.post('/', authenticate(true), createOrder);
orderRouter.get('/', authenticate(true), listOrders);
