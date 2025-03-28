import prisma from '../config/prismaClient';
import { UserRole } from '@prisma/client';
import { generateMonthlyExpenseInsights } from '../utils/openai';
import { getMonthName, getMonthStartEndDates } from '../utils/date';

interface ExpenseSummary {
  totalAmount: number;
  totalAmountPerCategory: Array<{ name: string, amount: number }>;
}

const getExpenseSummary = async (startDate: Date, endDate: Date, groupId?: string): Promise<ExpenseSummary> => {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        Receipt: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          ...(groupId && { groupId }),
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

export const getMonthlyExpenseSummary = async (startDate: Date, endDate: Date, userRole: UserRole, groupId?: string): Promise<ExpenseSummary> => {
  try {
    if (startDate > endDate) {
      throw new Error('Start date cannot be after end date');
    }

    if (userRole === UserRole.BASIC) {
      throw new Error('Basic users cannot access custom date summaries');
    }

    return getExpenseSummary(startDate, endDate, groupId);
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

export const getMonthlyInsight = async (groupId: string, month: string, year: string, newInsight: boolean): Promise<MonthlyInsight> => {
  if (!groupId) {
    throw new Error('Group ID is required');
  }

  const { startDate, endDate } = getMonthStartEndDates(year, month);


  try {
    // Delete existing insight if newInsight is true
    if (newInsight) {
      await prisma.insight.deleteMany({
        where: {
          groupId,
          date: {
            gte: startDate,
            lt: endDate,
          }
        }
      });
    } else {
      // Check if insight already exists for this month and group
      const existingInsight = await prisma.insight.findFirst({
        where: {
          groupId,
          date: {
            gte: startDate,
            lt: endDate,
          }
        }
      });

      if (existingInsight) {
        return {
          summary: existingInsight.summary,
          topCategories: existingInsight.topCategories,
          savingOpportunities: '', // This field isn't in the schema, but we'll include it in the response
          tips: existingInsight.tips
        };
      }
    }

    // Generate new insight
    // First, get the expense summary for the month
    const expenseSummary = await getExpenseSummary(
      startDate,
      endDate,
      groupId
    );

    // Generate insights using OpenAI
    const generatedInsight = await generateMonthlyExpenseInsights(
      expenseSummary,
      month,
      year
    );

    // Save the insight to the database
    await prisma.insight.create({
      data: {
        date: startDate,
        groupId,
        summary: generatedInsight.summary,
        topCategories: generatedInsight.topCategories,
        savingOpportunities: generatedInsight.savingOpportunities,
        tips: generatedInsight.tips
      }
    });

    return {
      summary: generatedInsight.summary,
      topCategories: generatedInsight.topCategories,
      savingOpportunities: generatedInsight.savingOpportunities,
      tips: generatedInsight.tips
    };
  } catch (error) {
    console.error('Error getting monthly insight:', error);
    throw new Error('Failed to get monthly insight');
  }
}
