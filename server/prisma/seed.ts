import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { name: 'Витамины группы B' },
  { name: 'Витамин D' },
  { name: 'Комплексы для иммунитета' }
];

const products = [
  {
    title: 'Витаминный комплекс Sunrise',
    description: 'Утренний заряд энергии и поддержки иммунитета.',
    priceCents: 1599,
    categoryIndex: 0,
    imagePath: '/assets/products/vitamin-1.svg',
    stock: 50,
    rating: 4.8,
    form: 'капсулы',
    brand: 'Sunrise Labs'
  },
  {
    title: 'B12 Ultra Focus',
    description: 'Поддержка нервной системы и ясного мышления.',
    priceCents: 1899,
    categoryIndex: 0,
    imagePath: '/assets/products/vitamin-2.svg',
    stock: 40,
    rating: 4.6,
    form: 'таблетки',
    brand: 'Focus+ Nutrition'
  },
  {
    title: 'Витамин D3 Nordic Light',
    description: 'Высокая концентрация в удобных капсулах.',
    priceCents: 2199,
    categoryIndex: 1,
    imagePath: '/assets/products/vitamin-3.svg',
    stock: 60,
    rating: 4.9,
    form: 'капсулы',
    brand: 'Nordic Light'
  },
  {
    title: 'Immuno Shield',
    description: 'Комплекс натуральных экстрактов для защиты организма.',
    priceCents: 2499,
    categoryIndex: 2,
    imagePath: '/assets/products/vitamin-4.svg',
    stock: 55,
    rating: 4.7,
    form: 'капсулы',
    brand: 'Shield Pharma'
  },
  {
    title: 'Витамин C Citrus Bloom',
    description: 'Шипучие таблетки с натуральным вкусом апельсина.',
    priceCents: 1299,
    categoryIndex: 2,
    imagePath: '/assets/products/vitamin-5.svg',
    stock: 70,
    rating: 4.5,
    form: 'шипучие таблетки',
    brand: 'Citrus Bloom'
  },
  {
    title: 'D3 Kids Sunny Drops',
    description: 'Капли для детей с мягким натуральным вкусом.',
    priceCents: 1799,
    categoryIndex: 1,
    imagePath: '/assets/products/vitamin-6.svg',
    stock: 45,
    rating: 4.9,
    form: 'капли',
    brand: 'Sunny Drops'
  },
  {
    title: 'B-Complex Daily',
    description: 'Сбалансированная формула витаминов группы B.',
    priceCents: 1699,
    categoryIndex: 0,
    imagePath: '/assets/products/vitamin-7.svg',
    stock: 65,
    rating: 4.4,
    form: 'капсулы',
    brand: 'Daily Balance'
  },
  {
    title: 'Golden Immunity Gummies',
    description: 'Жевательные мармеладки для взрослых.',
    priceCents: 2099,
    categoryIndex: 2,
    imagePath: '/assets/products/vitamin-8.svg',
    stock: 35,
    rating: 4.6,
    form: 'жевательные пастилки',
    brand: 'Golden Immunity'
  },
  {
    title: 'Витамин D3 Softgels',
    description: 'Легко усваиваемые мягкие капсулы.',
    priceCents: 1999,
    categoryIndex: 1,
    imagePath: '/assets/products/vitamin-9.svg',
    stock: 80,
    rating: 4.8,
    form: 'софтгель',
    brand: 'SoftGels Co.'
  },
  {
    title: 'Immunity Spark Effervescent',
    description: 'Растворимые таблетки с комплексом минералов.',
    priceCents: 1899,
    categoryIndex: 2,
    imagePath: '/assets/products/vitamin-10.svg',
    stock: 75,
    rating: 4.7,
    form: 'шипучие таблетки',
    brand: 'Spark Labs'
  }
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const createdCategories = await Promise.all(categories.map((category) => prisma.category.create({ data: category })));

  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const userPasswordHash = await bcrypt.hash('User123!', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'Администратор',
        email: 'admin@test.local',
        passwordHash: adminPasswordHash,
        role: 'ADMIN'
      },
      {
        name: 'Тестовый пользователь',
        email: 'user@test.local',
        passwordHash: userPasswordHash,
        role: 'USER'
      }
    ]
  });

  for (const product of products) {
    const category = createdCategories[product.categoryIndex];
    await prisma.product.create({
      data: {
        title: product.title,
        description: product.description,
        priceCents: product.priceCents,
        categoryId: category.id,
        imagePath: product.imagePath,
        stock: product.stock,
        rating: product.rating
      }
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

