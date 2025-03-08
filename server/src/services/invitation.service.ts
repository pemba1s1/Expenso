import prisma from '../config/prismaClient';
import { sendInviteEmail } from '../utils/email';
import { logger } from '../utils/logger';
import bcryptjs from 'bcryptjs';

export const inviteUser = async (email: string, adminId: string, groupId: string) => {
  // Check if the user has the admin role
  const userGroup = await prisma.userGroup.findFirst({
    where: {
      userId: adminId,
      groupId: groupId,
      role: 'admin',
    },
  });

  if (!userGroup) {
    throw new Error('Only admins can invite users to the group');
  }
  const invitation = await prisma.invitation.create({
    data: {
      email,
      adminId,
      groupId,
    },
  });

  let user = await prisma.user.findUnique({
    where: { email: invitation.email },
  });

  let inviteLink;

  if (user) inviteLink = `http://localhost:5000/invitation/accept/${invitation.id}`;
  else inviteLink = `http://localhost:5000/invitation/accept/${invitation.id}?password=true`;  
  
  logger.info(`Invitation link: ${inviteLink}`);
  
  // await sendInviteEmail(email, inviteLink);

  return invitation;
};

export const acceptInvitation = async (invitationId: string, password?: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { group: true },
  });

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  let user = await prisma.user.findUnique({
    where: { email: invitation.email },
  });

  if (!user) {
    if (!password) {
      throw new Error('Password is required for new users');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user = await prisma.user.create({
      data: {
        email: invitation.email,
        password: hashedPassword,
        verified: true,
      },
    });
  }

  await prisma.userGroup.create({
    data: {
      userId: user.id,
      groupId: invitation.groupId,
      role: 'member',
    },
  });

  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: 'accepted' },
  });

  return user;
};