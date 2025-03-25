import { User, UserRole } from '@prisma/client';
import prisma from '../config/prismaClient';

export const setUserCategoryLimit = async (user: User, categoryId: string, limit: number) => {
  try {
    //get current year and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    const userCategoryLimits = await prisma.userCategoryLimit.findMany({
      where: { userId: user.id, year: currentYear, month: currentMonth },
    });

    if (userCategoryLimits.length >= 4 && user.subscriptionPlan == UserRole.BASIC) {
      throw new Error('Basic User can only set limits for up to 4 categories');
    }

    const userCategoryLimit = await prisma.userCategoryLimit.create({
      data: {
        userId: user.id,
        categoryId,
        limit,
        year: currentYear,
        month: currentMonth,
      }
    });

    return userCategoryLimit;
  } catch (error) {
    throw new Error('Failed to set user category limit');
  }
};

export const updateUserCategoryLimit = async (id: string, limit: number) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const userCategoryLimit = await prisma.userCategoryLimit.update({
      where: { id, year: currentYear.toString(), month: currentMonth.toString() },
      data: {
        limit,
      },
    });

    return userCategoryLimit;
  } catch (error) {
    throw new Error('Failed to update user category limit');
  }
}
