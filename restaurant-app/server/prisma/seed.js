/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Starters', displayOrder: 1 },
  { name: 'Mains',    displayOrder: 2 },
  { name: 'Desserts', displayOrder: 3 },
  { name: 'Drinks',   displayOrder: 4 }
];

const DISHES = [
  // Starters
  {
    category: 'Starters', name: 'Spicy Paneer Tikka',
    description: 'Cubes of paneer marinated in yogurt and spices, charred over open flame.',
    priceCents: 1095, isVegetarian: true, isSpicy: true, isPopular: false,
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800'
  },
  {
    category: 'Starters', name: 'Crispy Calamari',
    description: 'Lightly battered squid rings served with lemon aioli.',
    priceCents: 1295, isVegetarian: false, isSpicy: false, isPopular: false,
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800'
  },
  // Mains
  {
    category: 'Mains', name: 'Butter Chicken',
    description: 'Tender chicken in a creamy tomato gravy with kasuri methi.',
    priceCents: 1795, isVegetarian: false, isSpicy: true, isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800'
  },
  {
    category: 'Mains', name: 'Margherita Pizza',
    description: 'San Marzano tomato, fior di latte, fresh basil, EVOO.',
    priceCents: 1495, isVegetarian: true, isSpicy: false, isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800'
  },
  {
    category: 'Mains', name: 'Mushroom Risotto',
    description: 'Arborio rice slow-cooked with mixed mushrooms and parmesan.',
    priceCents: 1595, isVegetarian: true, isSpicy: false, isPopular: false,
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800'
  },
  // Desserts
  {
    category: 'Desserts', name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, vanilla ice cream.',
    priceCents: 895, isVegetarian: true, isSpicy: false, isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800'
  },
  {
    category: 'Desserts', name: 'Mango Kulfi',
    description: 'Slow-cooked Indian ice cream with Alphonso mango.',
    priceCents: 695, isVegetarian: true, isSpicy: false, isPopular: false,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'
  },
  // Drinks
  {
    category: 'Drinks', name: 'Mint Lemonade',
    description: 'Fresh-squeezed lemon, muddled mint, sparkling water.',
    priceCents: 495, isVegetarian: true, isSpicy: false, isPopular: false,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800'
  }
];

async function main() {
  // Categories
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: { displayOrder: c.displayOrder },
      create: c
    });
  }

  // Dishes
  for (const d of DISHES) {
    const cat = await prisma.category.findUnique({ where: { name: d.category } });
    if (!cat) throw new Error(`Missing category ${d.category}`);
    await prisma.dish.upsert({
      where: { categoryId_name: { categoryId: cat.id, name: d.name } },
      update: {
        description: d.description, priceCents: d.priceCents, imageUrl: d.imageUrl,
        isVegetarian: d.isVegetarian, isSpicy: d.isSpicy, isPopular: d.isPopular
      },
      create: {
        categoryId: cat.id, name: d.name, description: d.description,
        priceCents: d.priceCents, imageUrl: d.imageUrl,
        isVegetarian: d.isVegetarian, isSpicy: d.isSpicy, isPopular: d.isPopular
      }
    });
  }

  // Admin user (idempotent)
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin12345';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: 'admin', name: 'Admin' },
    create: { email: adminEmail, passwordHash, role: 'admin', name: 'Admin' }
  });

  console.log(`Seeded ${CATEGORIES.length} categories, ${DISHES.length} dishes, admin=${adminEmail} / ${adminPassword}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
