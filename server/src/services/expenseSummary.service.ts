import prisma from '../config/prismaClient';
import { UserRole } from '@prisma/client';

interface ExpenseSummary {
  totalAmount: number;
  totalAmountPerCategory: Array<{ name: string, amount: number }>;
}

const getExpenseSummary = async (startDate: Date, endDate: Date, groupId?: string): Promise<ExpenseSummary> => {

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(groupId && { groupId }),
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
        userId: true,
        groupId: true,
        details: {
          select: {
            categoryId: true,
            amount: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const totalAmountPerCategory: Record<string, { name: string, amount: number }> = {};

    expenses.forEach(expense => {
      expense.details.forEach(category => {
        if (!totalAmountPerCategory[category.categoryId]) {
          totalAmountPerCategory[category.categoryId] = { name: category.category.name, amount: 0 };
        }
        totalAmountPerCategory[category.categoryId].amount += category.amount;
      });
    });

    return {
      totalAmount,
      totalAmountPerCategory: Object.values(totalAmountPerCategory),
    };
  } catch (error) {
    throw new Error('Failed to generate expense summary');
  }
};

export const getExpenseSummaryForCustomDateRange = async (startDate: Date, endDate: Date, userRole: UserRole, groupId?: string): Promise<ExpenseSummary> => {
  if (userRole === UserRole.BASIC) {
    throw new Error('Basic users cannot access custom date summaries');
  }

  return getExpenseSummary(startDate, endDate, groupId);
}

export const getMonthlyExpenseSummary = async (year: number, month: number, userRole: UserRole, groupId?: string): Promise<ExpenseSummary> => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return getExpenseSummary(startDate, endDate, groupId);
}
