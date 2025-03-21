import { User, UserRole } from '@prisma/client';
import prisma from '../config/prismaClient';

export const setUserCategoryLimit = async (user: User, categoryId: string, limit: number) => {
  try {
    const userCategoryLimits = await prisma.userCategoryLimit.findMany({
      where: { userId: user.id },
    });

    if (userCategoryLimits.length >= 4 && user.role == UserRole.BASIC) {
      throw new Error('Basic User can only set limits for up to 4 categories');
    }

    const userCategoryLimit = await prisma.userCategoryLimit.upsert({
      where: {
        userId_categoryId: {
          userId: user.id,
          categoryId,
        },
      },
      update: {
        limit,
      },
      create: {
        userId: user.id,
        categoryId,
        limit,
      },
    });

    return userCategoryLimit;
  } catch (error) {
    throw new Error('Failed to set user category limit');
  }
};
