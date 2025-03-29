import prisma from '../config/prismaClient';
import { UserRole } from '@prisma/client';
import { generateMonthlyExpenseInsights } from '../utils/openai';
import { getMonthName, getMonthStartEndDates } from '../utils/date';

interface ExpenseSummary {
  totalAmount: number;
  totalAmountPerCategory: Array<{ name: string, amount: number }>;
}

const getExpenseSummary = async (startDate: Date, endDate: Date, userId: string, groupId?: string): Promise<ExpenseSummary> => {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        Receipt: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          userId,
          ...(groupId ? { groupId } : {}),
        },
      },
      select: {
        id: true,
        amount: true,
        description: true,
        status: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        Receipt: {
          select: {
            createdAt: true,
            receiptImageUrl: true,
            userId: true,
            groupId: true,
          },
        },
      },
    });

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const totalAmountPerCategory: Record<string, { name: string, amount: number }> = {};

    expenses.forEach(expense => {
      if (expense.category) {
        const categoryId = expense.category.id;
        if (!totalAmountPerCategory[categoryId]) {
          totalAmountPerCategory[categoryId] = { name: expense.category.name, amount: 0 };
        }
        totalAmountPerCategory[categoryId].amount += expense.amount;
      }
    });

    return {
      totalAmount,
      totalAmountPerCategory: Object.values(totalAmountPerCategory),
    };
  } catch (error) {
    console.error('Error getting expense summary:', error);
    throw new Error('Failed to generate expense summary');
  }
};

export const getMonthlyExpenseSummary = async (startDate: Date, endDate: Date, userRole: UserRole, userId: string, groupId?: string): Promise<ExpenseSummary> => {
  try {
    if (startDate > endDate) {
      throw new Error('Start date cannot be after end date');
    }

    if (userRole === UserRole.BASIC) {
      throw new Error('Basic users cannot access custom date summaries');
    }

    return getExpenseSummary(startDate, endDate, userId, groupId);
  }
  catch (error) {
    throw error;
  }
}

export interface MonthlyInsight {
  summary: string;
  topCategories: string;
  savingOpportunities: string;
  tips: string[];
}

export const getMonthlyInsight = async (month: string, year: string, newInsight: boolean, userId: string, groupId?: string): Promise<MonthlyInsight> => {
  const { startDate, endDate } = getMonthStartEndDates(year, month);

  try {
    // If not requesting new insight, get the most recent insight
    if (!newInsight) {
      const existingInsight = await prisma.insight.findFirst({
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          },
          userId,
          groupId: groupId || null
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (existingInsight) {
        return {
          summary: existingInsight.summary,
          topCategories: existingInsight.topCategories,
          savingOpportunities: existingInsight.savingOpportunities,
          tips: existingInsight.tips
        };
      }
    }

    // Generate new insight
    const expenseSummary = await getExpenseSummary(startDate, endDate, userId, groupId);
    const generatedInsight = await generateMonthlyExpenseInsights(expenseSummary, month, year);

    // Create new insight
    const savedInsight = await prisma.insight.create({
      data: {
        summary: generatedInsight.summary,
        topCategories: generatedInsight.topCategories,
        savingOpportunities: generatedInsight.savingOpportunities,
        tips: generatedInsight.tips,
        date: startDate,
        userId,
        groupId: groupId || null
      }
    });

    return {
      summary: savedInsight.summary,
      topCategories: savedInsight.topCategories,
      savingOpportunities: savedInsight.savingOpportunities,
      tips: savedInsight.tips
    };
  } catch (error) {
    console.error('Error getting monthly insight:', error);
    throw new Error('Failed to get monthly insight');
  }
}
