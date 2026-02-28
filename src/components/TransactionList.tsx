import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenses } from '@/context/ExpenseContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_ICONS } from '@/utils/types';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Edit2, Trash2, Search, Filter, Receipt } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  Travel: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  Bills: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  Shopping: 'bg-pink-500/15 text-pink-600 dark:text-pink-400',
  Entertainment: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  Health: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  Education: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
  Other: 'bg-gray-500/15 text-gray-600 dark:text-gray-400',
  Salary: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Freelance: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
  Investment: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
  Gift: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
};

interface Props {
  onEdit: (id: string) => void;
}

export default function TransactionList({ onEdit }: Props) {
  const { transactions, deleteTransaction } = useExpenses();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filtered = transactions.filter(t => {
    if (search && !t.description.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const allCategories = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

  return (
    <div className="glass-card-glow rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Receipt className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold">Transactions</h3>
        </div>
        {filtered.length > 0 && (
          <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full bg-primary/10 text-primary text-xs font-bold">
            {filtered.length}
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-36 rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-40 rounded-xl">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map(c => <SelectItem key={c} value={c}>{CATEGORY_ICONS[c]} {c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl mb-4 inline-block"
          >
            📭
          </motion.div>
          <p className="font-display font-semibold text-lg">No transactions found</p>
          <p className="text-sm text-muted-foreground mt-1">Add your first transaction to get started!</p>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Scroll fade top */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-card/70 to-transparent z-10 rounded-t-lg" />

          <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1 py-1">
            <AnimatePresence mode="popLayout">
              {filtered.map(t => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group"
                >
                  {/* Category icon */}
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg shrink-0 ${CATEGORY_COLORS[t.category] || 'bg-muted'}`}>
                    {CATEGORY_ICONS[t.category] || '📦'}
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{t.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`category-badge ${CATEGORY_COLORS[t.category] || 'bg-muted text-muted-foreground'}`}>
                        {t.category}
                      </span>
                      <span className="text-xs text-muted-foreground">· {formatDate(t.date)}</span>
                    </div>
                  </div>
                  {/* Amount */}
                  <p className={`font-display font-bold text-sm whitespace-nowrap ${t.type === 'income' ? 'text-green-500' : 'text-rose-500'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10" onClick={() => onEdit(t.id)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => deleteTransaction(t.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Scroll fade bottom */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-card/70 to-transparent z-10 rounded-b-lg" />
        </div>
      )}
    </div>
  );
}
