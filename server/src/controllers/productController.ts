import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { z } from 'zod';

const listSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  page: z.string().optional()
});

export async function listProducts(req: Request, res: Response) {
  const params = listSchema.parse(req.query);
  const page = params.page ? parseInt(params.page, 10) : 1;
  const take = 12;
  const skip = (page - 1) * take;

  const where: any = {};
  if (params.category) {
    where.category = { name: params.category };
  }
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } }
    ];
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      take,
      skip,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / take) });
}

export async function getProduct(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
}

export async function listCategories(_req: Request, res: Response) {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json(categories);
}
