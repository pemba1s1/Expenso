import { PrismaClient } from '@prisma/client';
import { sendInviteEmail } from '../utils/email';

const prisma = new PrismaClient();

export const inviteUser = async (email: string, adminId: string, groupId: string) => {
  const invitation = await prisma.invitation.create({
    data: {
      email,
      adminId,
      groupId,
    },
  });

  const inviteLink = `http://yourapp.com/invite/${invitation.id}`;
  await sendInviteEmail(email, inviteLink);

  return invitation;
};

export const acceptInvitation = async (invitationId: string, password: string) => {
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
    user = await prisma.user.create({
      data: {
        email: invitation.email,
        password,
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