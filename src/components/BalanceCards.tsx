import { motion } from 'framer-motion';
import { useExpenses } from '@/context/ExpenseContext';
import { formatCurrency } from '@/utils/helpers';
import { TrendingUp, TrendingDown, Wallet, AlertTriangle } from 'lucide-react';

const cards = [
  { key: 'balance', label: 'Total Balance', icon: Wallet, color: 'primary' },
  { key: 'income', label: 'Total Income', icon: TrendingUp, color: 'income' },
  { key: 'expenses', label: 'Total Expenses', icon: TrendingDown, color: 'expense' },
] as const;

export default function BalanceCards() {
  const { balance, totalIncome, totalExpenses, isOverBudget, budgetLimit } = useExpenses();
  const values = { balance, income: totalIncome, expenses: totalExpenses };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${card.color}/10`}>
              <card.icon className={`h-5 w-5 text-${card.color}`} />
            </div>
          </div>
          <p className="font-display text-2xl font-bold">{formatCurrency(values[card.key])}</p>
        </motion.div>
      ))}
      {isOverBudget && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="sm:col-span-3 flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4"
        >
          <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
          <p className="text-sm font-medium">
            Budget exceeded! You've spent {formatCurrency(totalExpenses)} of your {formatCurrency(budgetLimit)} budget.
          </p>
        </motion.div>
      )}
    </div>
  );
}
