
import prisma from './src/config/prismaClient';
import { logger } from './src/utils/logger';

export const defaultCategories = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Debt Payments",
  "Personal Spending",
  "Entertainment",
  "Subscriptions/Memberships",
  "Gifts/Donations",
  "Savings/Investments",
  "Miscellaneous"
];

export const migrateCategories = async () => {
  logger.info("Migrating categories...");
  
  try {
    for (const categoryName of defaultCategories) {
      await prisma.category.upsert({
        where: { name: categoryName },
        update: {}, // No updates needed if exists
        create: { name: categoryName },
      });
    }
    logger.info("✅ Categories migrated successfully");
  } catch (error) {
    logger.error("❌ Failed to migrate categories");
    logger.error(error);
    throw error; // Propagate error to server startup
  }
};
