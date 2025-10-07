import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminListProducts,
  adminUpdateProduct
} from '../controllers/adminController.js';

export const adminRouter = Router();

adminRouter.use(authenticate(true), requireAdmin);

adminRouter.get('/products', adminListProducts);
adminRouter.post('/products', adminCreateProduct);
adminRouter.put('/products/:id', adminUpdateProduct);
adminRouter.delete('/products/:id', adminDeleteProduct);
