import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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