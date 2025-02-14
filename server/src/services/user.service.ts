import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const findOrCreateUser = async (profile: any) => {
  try {
    // Check if user already exists in the database
    let user = await prisma.user.findUnique({
      where: { googleId: profile.id },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos ? profile.photos[0].value : null,
        },
      });
      logger.info(`New user created: ${profile.emails[0].value}`);
    }

    return user;
  } catch (error) {
    logger.error('Error while finding/creating user', error);
    throw error;
  }
};
