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
  return userGroups.map(userGroup => userGroup.group);
};

export const getGroupById = async (groupId: string) => {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
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