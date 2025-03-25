
import prisma from './src/config/prismaClient';

const categories = [
  'Groceries',
  'Electronics',
  'Clothing',
  'Home Goods',
  'Health & Beauty',
  'Toys',
  'Books',
  'Sports Equipment',
  'Automotive',
  'Garden Supplies'
];

console.log("Migrating categories");

const createCategories = async () => {
  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category,
      },
    });
  }
};

createCategories().then(() => {
  console.log("Categories migrated successfully");
}).catch((error) => {
  console.error("Failed to migrate categories", error);
});

