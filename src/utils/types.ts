export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface BudgetLimit {
  userId: string;
  amount: number;
}

export const EXPENSE_CATEGORIES = [
  'Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Education', 'Other'
] as const;

export const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
] as const;

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍔', Travel: '✈️', Bills: '📄', Shopping: '🛍️',
  Entertainment: '🎬', Health: '💊', Education: '📚', Other: '📦',
  Salary: '💰', Freelance: '💻', Investment: '📈', Gift: '🎁',
};
