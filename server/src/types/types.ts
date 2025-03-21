import { ExpenseCategory, ExpenseItem } from '@prisma/client';

export type ExpenseItemWithoutId = Omit<ExpenseItem, 'id' | 'expenseCategoryId' | 'createdAt' | 'updatedAt'>;

export type ExtendedExpenseCategory = Omit<ExpenseCategory, 'id' | 'expenseId' | 'createdAt' | 'updatedAt'> & { items: Array<ExpenseItemWithoutId> };