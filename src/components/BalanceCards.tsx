import { motion } from 'framer-motion';
import { useExpenses } from '@/context/ExpenseContext';
import { formatCurrency } from '@/utils/helpers';
import { TrendingUp, TrendingDown, Wallet, AlertTriangle, Sparkles } from 'lucide-react';

const cards = [
  {
    key: 'balance',
    label: 'Total Balance',
    icon: Wallet,
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'stat-gradient-balance',
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary',
  },
  {
    key: 'income',
    label: 'Total Income',
    icon: TrendingUp,
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'stat-gradient-income',
    iconBg: 'bg-green-500/15',
    iconColor: 'text-green-500',
  },
  {
    key: 'expenses',
    label: 'Total Expenses',
    icon: TrendingDown,
    gradient: 'from-rose-500 to-red-600',
    bgGradient: 'stat-gradient-expense',
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-500',
  },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export default function BalanceCards() {
  const { balance, totalIncome, totalExpenses, isOverBudget, budgetLimit } = useExpenses();
  const values = { balance, income: totalIncome, expenses: totalExpenses };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {cards.map((card) => (
        <motion.div
          key={card.key}
          variants={item}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`glass-card-glow rounded-2xl p-5 ${card.bgGradient} cursor-default`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} transition-transform`}>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="font-display text-3xl font-bold tracking-tight">
              {formatCurrency(values[card.key])}
            </p>
          </div>
          {/* Decorative sparkle */}
          <div className="flex items-center gap-1 mt-2">
            <Sparkles className={`h-3 w-3 ${card.iconColor} opacity-50`} />
            <span className="text-xs text-muted-foreground">
              {card.key === 'balance'
                ? 'Net balance'
                : card.key === 'income'
                  ? 'All time earnings'
                  : 'All time spending'}
            </span>
          </div>
        </motion.div>
      ))}

      {isOverBudget && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="sm:col-span-3 flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 backdrop-blur-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/20 shrink-0">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-sm font-semibold">Budget Exceeded!</p>
            <p className="text-xs text-muted-foreground">
              You've spent {formatCurrency(totalExpenses)} of your {formatCurrency(budgetLimit)} budget.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
