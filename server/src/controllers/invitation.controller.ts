import { Request, Response } from 'express';
import { inviteUser, acceptInvitation } from '../services/invitation.service';

export const inviteUserController = async (req: Request, res: Response) => {
  const { email, groupId } = req.body;
  const adminId = req.user.id;

  try {
    const invitation = await inviteUser(email, adminId, groupId);
    res.status(201).json(invitation);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const acceptInvitationController = async (req: Request, res: Response) => {
  const { invitationId, password } = req.body;

  try {
    const user = await acceptInvitation(invitationId, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};