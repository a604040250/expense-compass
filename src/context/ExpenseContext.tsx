import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, BudgetLimit } from '@/utils/types';
import { getFromStorage, setToStorage, generateId } from '@/utils/helpers';
import { useAuth } from './AuthContext';

interface ExpenseContextType {
  transactions: Transaction[];
  budgetLimit: number;
  addTransaction: (t: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setBudgetLimit: (amount: number) => void;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  isOverBudget: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => getFromStorage('transactions', []));
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimit[]>(() => getFromStorage('budgetLimits', []));

  useEffect(() => { setToStorage('transactions', allTransactions); }, [allTransactions]);
  useEffect(() => { setToStorage('budgetLimits', budgetLimits); }, [budgetLimits]);

  const transactions = useMemo(() =>
    allTransactions.filter(t => t.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [allTransactions, user?.id]
  );

  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance = totalIncome - totalExpenses;

  const budgetLimit = useMemo(() => budgetLimits.find(b => b.userId === user?.id)?.amount ?? 0, [budgetLimits, user?.id]);
  const isOverBudget = budgetLimit > 0 && totalExpenses > budgetLimit;

  const addTransaction = useCallback((t: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const newT: Transaction = { ...t, id: generateId(), userId: user.id, createdAt: new Date().toISOString() };
    setAllTransactions(prev => [...prev, newT]);
  }, [user]);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setAllTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setAllTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const setBudgetLimitFn = useCallback((amount: number) => {
    if (!user) return;
    setBudgetLimits(prev => {
      const filtered = prev.filter(b => b.userId !== user.id);
      return [...filtered, { userId: user.id, amount }];
    });
  }, [user]);

  return (
    <ExpenseContext.Provider value={{
      transactions, budgetLimit, addTransaction, updateTransaction, deleteTransaction,
      setBudgetLimit: setBudgetLimitFn, totalIncome, totalExpenses, balance, isOverBudget,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used within ExpenseProvider');
  return ctx;
}
