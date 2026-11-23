import { Category } from "../src/generated/prisma/enums.js";
import { prisma } from "../src/config/prisma.js";

const products = [
  // Coffee
  {
    name: "Classic Latte",
    category: Category.Coffee,
    description: "Rich espresso with steamed milk and a light layer of foam.",
    price: 4.5,
    imageUrl: "/images/coffee-1.avif",
    rating: 4.8,
  },
  {
    name: "Macchiato",
    category: Category.Coffee,
    description: "Espresso with vanilla syrup, milk, and caramel drizzle.",
    price: 5.2,
    imageUrl: "/images/coffee-2.avif",
    rating: 4.9,
  },
  {
    name: "Iced Americano",
    category: Category.Coffee,
    description: "Bold espresso over ice and water, perfect for hot days.",
    price: 3.5,
    imageUrl: "/images/coffee-3.avif",
    rating: 4.6,
  },
  {
    name: "Cappuccino",
    category: Category.Coffee,
    description: "Equal parts espresso, steamed milk, and milk foam.",
    price: 4.0,
    imageUrl: "/images/coffee-4.avif",
    rating: 4.7,
  },
  {
    name: "Mocha",
    category: Category.Coffee,
    description: "Espresso with chocolate syrup and steamed milk.",
    price: 5.0,
    imageUrl: "/images/coffee-5.avif",
    rating: 4.8,
  },

  // Tea
  {
    name: "Matcha Green Tea",
    category: Category.Tea,
    description: "Premium Japanese matcha whisked with steamed milk.",
    price: 5.5,
    imageUrl: "/images/tea-1.avif",
    rating: 4.9,
  },
  {
    name: "Earl Grey Reserve",
    category: Category.Tea,
    description: "Fragrant black tea with bergamot oil and blue cornflowers.",
    price: 4.0,
    imageUrl: "/images/tea-2.avif",
    rating: 4.7,
  },
  {
    name: "Chai Latte",
    category: Category.Tea,
    description: "Spiced black tea concentrate mixed with steamed milk.",
    price: 4.8,
    imageUrl: "/images/tea-3.avif",
    rating: 4.9,
  },
  {
    name: "Iced Peach Tea",
    category: Category.Tea,
    description:
      "Refreshing black tea infused with peach flavor and served over ice.",
    price: 4.2,
    imageUrl: "/images/tea-4.avif",
    rating: 4.6,
  },

  // Desserts
  {
    name: "Berry Croissant",
    category: Category.Desserts,
    description: "Buttery croissant filled with fresh berries and cream.",
    price: 3.8,
    imageUrl: "/images/desserts-1.avif",
    rating: 4.9,
  },
  {
    name: "Choco Lava Cake",
    category: Category.Desserts,
    description: "Decadent chocolate cake with a molten center.",
    price: 6.5,
    imageUrl: "/images/desserts-2.avif",
    rating: 4.8,
  },
  {
    name: "Cheesecake",
    category: Category.Desserts,
    description: "Creamy vanilla cheesecake with a graham cracker crust.",
    price: 5.5,
    imageUrl: "/images/desserts-3.avif",
    rating: 4.9,
  },
  {
    name: "Macarons",
    category: Category.Desserts,
    description: "Assorted french macarons with various fillings.",
    price: 6.0,
    imageUrl: "/images/desserts-4.avif",
    rating: 4.7,
  },

  // Breakfast
  {
    name: "Avocado Toast",
    category: Category.Breakfast,
    description:
      "Sourdough bread topped with fresh avocado, radish, and seeds.",
    price: 8.5,
    imageUrl: "/images/breakfast-1.avif",
    rating: 4.7,
  },
  {
    name: "Classic Pancakes",
    category: Category.Breakfast,
    description: "Fluffy pancakes served with maple syrup and butter.",
    price: 7.0,
    imageUrl: "/images/breakfast-2.avif",
    rating: 4.6,
  },
  {
    name: "Bagel with Cheese",
    category: Category.Breakfast,
    description: "Toasted bagel with a generous spread of cream cheese.",
    price: 3.5,
    imageUrl: "/images/breakfast-3.avif",
    rating: 4.5,
  },
  {
    name: "Granola Bowl",
    category: Category.Breakfast,
    description: "Greek yogurt topped with homemade granola and fresh fruits.",
    price: 6.0,
    imageUrl: "/images/breakfast-4.avif",
    rating: 4.8,
  },

  // Combos
  {
    name: "Morning Starter",
    category: Category.Combos,
    description: "Coffee + Croissant combo to start your day right.",
    price: 7.5,
    imageUrl: "/images/combos-1.avif",
    rating: 4.9,
  },
  {
    name: "Lunch Break",
    category: Category.Combos,
    description: "Sandwich + Iced Tea combo for a refreshing midday meal.",
    price: 12.0,
    imageUrl: "/images/combos-2.avif",
    rating: 4.8,
  },
];

async function main() {
  if ((await prisma.product.count()) > 0) {
    console.log("Products already seeded, nothing to do.");
    return;
  }
  await prisma.product.createMany({ data: products });
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
