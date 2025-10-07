import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.js';

const cartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int(),
        qty: z.number().int().min(1)
      })
    )
    .min(1)
});

export async function summarizeCart(req: AuthRequest, res: Response) {
  const parse = cartSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid data', errors: parse.error.flatten() });
  }

  const productIds = parse.data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const summary = [];
  for (const item of parse.data.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ message: `Product ${item.productId} not found` });
    }
    summary.push({
      productId: product.id,
      title: product.title,
      qty: item.qty,
      unitPriceCents: product.priceCents,
      totalCents: product.priceCents * item.qty
    });
  }

  const totalCents = summary.reduce((acc, item) => acc + item.totalCents, 0);
  res.json({ items: summary, totalCents });
}

export async function createOrder(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const parse = cartSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid data', errors: parse.error.flatten() });
  }

  const productIds = parse.data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  const items = [];
  for (const item of parse.data.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ message: `Product ${item.productId} not found` });
    }
    items.push({
      productId: product.id,
      qty: item.qty,
      unitPriceCents: product.priceCents
    });
  }

  const totalCents = items.reduce((acc, item) => acc + item.unitPriceCents * item.qty, 0);

  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      totalCents,
      items: {
        create: items
      }
    },
    include: {
      items: { include: { product: { select: { title: true, imagePath: true } } } }
    }
  });

  res.status(201).json(order);
}

export async function listOrders(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: {
      items: {
        include: {
          product: { select: { title: true, imagePath: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
}
