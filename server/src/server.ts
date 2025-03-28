import app from "./app";
import { config } from "./config/env";
import prisma from "./config/prismaClient";
import { logger } from "./utils/logger";
import { getReceiptData } from "./utils/openai";
import { migrateCategories } from "../category-migrate";

async function startServer() {
  try {
    // Test database connection before starting the server
    await prisma.$connect();
    logger.info("✅ Successfully connected to the database");

    // Migrate default categories
    await migrateCategories();

    // Start the server only after successful database connection and migrations
    app.listen(config.PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${config.PORT}`);
    });



  } catch (error) {
    console.log(error);
    logger.error("❌ Failed to connect to the database");
    logger.error(error);
    process.exit(1); // Exit with error code
  }
}

// Start the server
startServer();
