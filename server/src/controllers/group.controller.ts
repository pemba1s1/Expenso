import { Request, Response } from 'express';
import { createGroup, getGroupById, getUserGroups, getGroupUsers } from '../services/group.service';
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

export const getGroupByIdController = async (req: Request, res: Response) => {
  const groupId = req.params.id;
  const user: User = req.user as User;

  if (!user.id) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    const group = await getGroupById(groupId);
    res.status(200).json(group);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}

export const getUserGroupsController = async (req: Request, res: Response) => {
  const user: User = req.user as User;

  if (!user.id) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    const groups = await getUserGroups(user.id);
    res.status(200).json(groups);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const getGroupUsersController = async (req: Request, res: Response) => {
  const groupId = req.params.id;

  try {
    const users = await getGroupUsers(groupId);
    res.status(200).json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};
