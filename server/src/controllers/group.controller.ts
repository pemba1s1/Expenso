import { Request, Response } from 'express';
import { createGroup } from '../services/group.service';

export const createGroupController = async (req: Request, res: Response) => {
  const { name } = req.body;
  const adminId = req.user?.id;

  if (!adminId) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    const group = await createGroup(name, adminId);
    res.status(201).json(group);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};