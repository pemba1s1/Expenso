export interface CreateExpenseInput {
  userId: string;
  groupId?: string;
  amount: number;
  receiptImage: any;
  details: Array<ExpenseCategory>;
}

export interface ExpenseItems {
  name: string;
  amount: number;
}

export interface ExpenseCategory {
  name: string;
  totalAmount: number;
  items: Array<ExpenseItems>;
}