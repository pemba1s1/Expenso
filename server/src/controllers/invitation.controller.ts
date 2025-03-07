import { Request, Response } from 'express';
import { inviteUser, acceptInvitation } from '../services/invitation.service';
import { User } from '@prisma/client';

export const inviteUserController = async (req: Request, res: Response) => {
  const { email, groupId } = req.body;
  const user: User = req.user as User;

  try {
    const invitation = await inviteUser(email, user.id, groupId);
    res.status(201).json(invitation);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};

export const acceptInvitationController = async (req: Request, res: Response) => {
  const { invitationId, password } = req.body;

  try {
    const user = await acceptInvitation(invitationId, password);
    res.status(200).json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};