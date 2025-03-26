import prisma from '../config/prismaClient';

export const getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    throw new Error('Failed to fetch categories');
  }
};
