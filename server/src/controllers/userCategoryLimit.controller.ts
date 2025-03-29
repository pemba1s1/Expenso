import { Request, Response } from 'express';
import { setUserCategoryLimit, updateUserCategoryLimit, getUserCategoryLimits } from '../services/userCategoryLimit.service';
import { User } from '@prisma/client';

export const setUserCategoryLimitController = async (req: Request, res: Response) => {
  const { categoryId, limit, groupId } = req.body;
  const user: User = req.user as User;

  if (!user.id) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    const userCategoryLimit = await setUserCategoryLimit(user, categoryId, limit, groupId);
    res.status(201).json(userCategoryLimit);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const getUserCategoryLimitsController = async (req: Request, res: Response) => {
  const user: User = req.user as User;
  const { groupId } = req.query;

  if (!user.id) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    const userCategoryLimits = await getUserCategoryLimits(user.id, groupId as string | undefined);
    res.status(200).json(userCategoryLimits);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const updateCategoryLimitController = async (req: Request, res: Response) => {
  const { id, limit, groupId } = req.body;
  const user: User = req.user as User;

  if (!user.id) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    const userCategoryLimit = await updateUserCategoryLimit(id, limit, groupId);
    res.status(200).json(userCategoryLimit);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}
