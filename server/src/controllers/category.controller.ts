import { Request, Response } from 'express';
import { getAllCategories, getCategoryByName, getCategoryById, createCategory, updateCategory, deleteCategory } from '../services/category.service';

export const getAllCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const getCategoryByNameController = async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    const category = await getCategoryByName(name);
    res.status(200).json(category);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const getCategoryByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await getCategoryById(id);
    res.status(200).json(category);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const createCategoryController = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }

  try {
    const category = await createCategory(name);
    res.status(200).json(category);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const updateCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }

  try {
    const category = await updateCategory(id, name);
    res.status(200).json(category);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteCategory(id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};
