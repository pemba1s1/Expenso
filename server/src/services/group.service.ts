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
  const groups = await prisma.group.findMany({
    where: {
      userGroups: {
        some: {
          userId,
        },
      },
    },
    include: {
      userGroups: true,
      invitations: true,
    },
  });
  return groups;
};

export const getGroupById = async (groupId: string) => {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });
  return group;
}