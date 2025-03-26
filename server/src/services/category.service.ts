import prisma from '../config/prismaClient';

export const getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    throw new Error('Failed to fetch categories');
  }
};

export const getCategoryByName = async (name: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: { name },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  } catch (error) {
    throw new Error('Failed to fetch category');
  }
}

export const getCategoryById = async (id: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  } catch (error) {
    throw new Error('Failed to fetch category');
  }
}

export const createCategory = async (name: string) => {
  try {
    const category = await prisma.category.create({
      data: { name },
    });

    return category;
  } catch (error) {
    throw new Error('Failed to create category');
  }
}

export const updateCategory = async (id: string, name: string) => {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return category;
  } catch (error) {
    throw new Error('Failed to update category');
  }
}

export const deleteCategory = async (id: string) => {
  try {
    const category = await prisma.category.delete({
      where: { id },
    });

    return category;
  } catch (error) {
    throw new Error('Failed to delete category');
  }
}
