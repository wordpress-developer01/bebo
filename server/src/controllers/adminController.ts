import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { z } from 'zod';

const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  categoryId: z.number().int(),
  imagePath: z.string().min(1),
  stock: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5).optional(),
  form: z.string().min(1).optional(),
  brand: z.string().min(1).optional()
});

export async function adminListProducts(_: Request, res: Response) {
  const products = await prisma.product.findMany({ include: { category: true } });
  res.json(products);
}

export async function adminCreateProduct(req: Request, res: Response) {
  const parse = productSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid data', errors: parse.error.flatten() });
  }
  const product = await prisma.product.create({ data: parse.data });
  res.status(201).json(product);
}

export async function adminUpdateProduct(req: Request, res: Response) {
  const parse = productSchema.partial().safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid data', errors: parse.error.flatten() });
  }
  const id = parseInt(req.params.id, 10);
  try {
    const product = await prisma.product.update({ where: { id }, data: parse.data });
    res.json(product);
  } catch (err) {
    res.status(404).json({ message: 'Product not found' });
  }
}

export async function adminDeleteProduct(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  try {
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ message: 'Product not found' });
  }
}
