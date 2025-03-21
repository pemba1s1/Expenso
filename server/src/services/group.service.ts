import prisma from '../config/prismaClient';
import { GroupType, User, UserRole } from '@prisma/client';

export const createGroup = async (name: string, user: User, type: GroupType = GroupType.NORMAL) => {

  if (type === GroupType.BUSINESS && user.role !== UserRole.BUSINESS_PREMIUM) {
    throw new Error('Only Business Premium users can create Business groups');
  }

  const group = await prisma.group.create({
    data: {
      name,
      type,
      userGroups: {
        create: {
          userId: user.id,
          role: 'admin',
        },
      },
    },
  });
  return group;
};

export const getUserGroups = async (userId: string) => {
  const userGroups = await prisma.userGroup.findMany({
    where: { userId },
    include: { group: true },
  });
  return userGroups;
};

export const getGroupById = async (groupId: string, userId: string) => {
  const group = await prisma.userGroup.findFirst({
    where: { groupId, userId },
    include: { group: true },
  });
  return group;
};

export const getGroupUsers = async (groupId: string) => {
  const users = await prisma.userGroup.findMany({
    where: { groupId },
    include: { user: true },
  });
  return users.map(userGroup => userGroup.user);
};