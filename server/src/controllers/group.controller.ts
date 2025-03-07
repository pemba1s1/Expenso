import { Request, Response } from 'express';
import { createGroup } from '../services/group.service';
import { User } from '@prisma/client';

export const createGroupController = async (req: Request, res: Response) => {
  const { name } = req.body;
  const user: User = req.user as User;

  if (!user.id) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    const group = await createGroup(name, user.id);
    res.status(201).json(group);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};