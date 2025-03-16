import prisma from '../config/prismaClient';

export const setUserCategoryLimit = async (userId: string, categoryId: string, limit: number) => {
  try {
    const userCategoryLimit = await prisma.userCategoryLimit.upsert({
      where: {
        userId_categoryId: {
          userId,
          categoryId,
        },
      },
      update: {
        limit,
      },
      create: {
        userId,
        categoryId,
        limit,
      },
    });

    return userCategoryLimit;
  } catch (error) {
    throw new Error('Failed to set user category limit');
  }
};
