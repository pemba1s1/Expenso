import prisma from '../config/prismaClient';
import { UserRole } from '@prisma/client';
import { generateMonthlyExpenseInsights } from '../utils/openai';

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

export interface MonthlyInsight {
  summary: string;
  topCategories: string;
  savingOpportunities: string;
  tips: string[];
}

export const getMonthlyInsight = async (groupId: string, date: Date): Promise<MonthlyInsight> => {
  if (!groupId) {
    throw new Error('Group ID is required');
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  
  // Create a date for the first day of the month
  const monthStart = new Date(year, month - 1, 1);
  
  try {
    // Check if insight already exists for this month and group
    const existingInsight = await prisma.Insight.findFirst({
      where: {
        groupId,
        date: {
          gte: monthStart,
          lt: new Date(year, month, 1) // First day of next month
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

    // No existing insight, generate a new one
    // First, get the expense summary for the month
    const expenseSummary = await getExpenseSummary(
      monthStart,
      new Date(year, month, 0), // Last day of the month
      groupId
    );

    // Generate insights using OpenAI
    const generatedInsight = await generateMonthlyExpenseInsights(
      expenseSummary,
      month,
      year
    );

    // Save the insight to the database
    await prisma.Insight.create({
      data: {
        date: monthStart,
        groupId,
        summary: generatedInsight.summary,
        topCategories: generatedInsight.topCategories,
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
