import { Router } from 'express';
import { getProduct, listProducts, listCategories } from '../controllers/productController.js';

export const productRouter = Router();

productRouter.get('/', listProducts);
productRouter.get('/categories/all', listCategories);
productRouter.get('/:id', getProduct);
