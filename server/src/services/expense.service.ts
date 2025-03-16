
import prisma from '../config/prismaClient';
import { ExtendedExpenseCategory } from '../types/types';

interface ExpenseDetails {
  expense: {
    userId: string, 
    groupId: string, 
    amount: number, 
    receiptImageUrl: string
  }, 
  expenseCategory: Array<ExtendedExpenseCategory>
}

export const createExpense = async ({ expense : { userId, groupId, amount, receiptImageUrl }, expenseCategory }: ExpenseDetails) => {
  try {
    const expense = await prisma.$transaction(async (prisma) => {
      const createdExpense = await prisma.expense.create({
        data: {
          userId,
          groupId,
          amount,
          receiptImageUrl,
          status: groupId ? 'pending' : undefined,
        },
      });

      for (const category of expenseCategory) {
        const createdCategory = await prisma.expenseCategory.create({
          data: {
            amount: category.amount,
            expenseId: createdExpense.id,
            categoryId: category.categoryId,
          },
        });

        for (const item of category.items) {
          await prisma.expenseItem.create({
            data: {
              name: item.name,
              amount: item.amount,
              expenseCategoryId: createdCategory.id,
            },
          });
        }
      }

      return createdExpense;
    });

    return expense;
  } catch (error) {
    throw new Error('Failed to create expense');
  }
};

export const approveExpense = async (expenseId: string, adminId: string) => {
  try {
    const expense = await prisma.expense.update({
      where: { id: expenseId },
      data: { status: 'approved', approvedBy: adminId },
    });

    return expense;
  } catch (error) {
    throw new Error('Failed to approve expense');
  }
};

