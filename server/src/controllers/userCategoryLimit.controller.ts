import { Request, Response } from 'express';
import { setUserCategoryLimit } from '../services/userCategoryLimit.service';
import { User } from '@prisma/client';

export const setUserCategoryLimitController = async (req: Request, res: Response) => {
  const { categoryId, limit } = req.body;
  const user: User = req.user as User;

  if (!user.id) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    const userCategoryLimit = await setUserCategoryLimit(user, categoryId, limit);
    res.status(201).json(userCategoryLimit);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};
