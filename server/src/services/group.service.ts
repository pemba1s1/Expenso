import prisma from '../config/prismaClient';

export const createGroup = async (name: string, adminId: string) => {
  const group = await prisma.group.create({
    data: {
      name,
      userGroups: {
        create: {
          userId: adminId,
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