export type Role = 'USER' | 'ADMIN';

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  priceCents: number;
  imagePath: string;
  stock: number;
  rating: number;
  categoryId: number;
  category?: { id: number; name: string };
  form?: string | null;
  brand?: string | null;
};

export type CartItem = {
  product: Product;
  qty: number;
};

export type Order = {
  id: number;
  totalCents: number;
  status: string;
  createdAt: string;
  items: {
    productId: number;
    qty: number;
    unitPriceCents: number;
    product?: { title: string; imagePath: string };
  }[];
};
