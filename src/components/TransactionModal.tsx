import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenses } from '@/context/ExpenseContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_ICONS } from '@/utils/types';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  editId?: string | null;
}

export default function TransactionModal({ open, onClose, editId }: Props) {
  const { addTransaction, updateTransaction, transactions } = useExpenses();
  const { toast } = useToast();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (editId) {
      const t = transactions.find(t => t.id === editId);
      if (t) {
        setType(t.type);
        setAmount(t.amount.toString());
        setCategory(t.category);
        setDescription(t.description);
        setDate(t.date);
      }
    } else {
      setType('expense');
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editId, open, transactions]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    const data = { type, amount: parseFloat(amount), category, description, date };
    if (editId) {
      updateTransaction(editId, data);
      toast({ title: '✅ Updated!', description: 'Transaction updated successfully' });
    } else {
      addTransaction(data);
      toast({ title: '🎉 Added!', description: `${type === 'income' ? 'Income' : 'Expense'} added successfully` });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md glass-card rounded-3xl p-6 z-10 border border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold gradient-text">{editId ? 'Edit' : 'New'} Transaction</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted/80">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type toggle with animated indicator */}
              <div className="relative flex rounded-2xl bg-muted p-1">
                <motion.div
                  className={`absolute top-1 bottom-1 rounded-xl ${type === 'expense' ? 'bg-rose-500' : 'bg-emerald-500'} shadow-lg`}
                  layout
                  style={{ width: 'calc(50% - 4px)' }}
                  animate={{ x: type === 'expense' ? 0 : '100%' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
                {(['expense', 'income'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setType(t); setCategory(''); }}
                    className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${type === t ? 'text-white' : 'text-muted-foreground'}`}
                  >
                    {t === 'income' ? '💰 Income' : '💸 Expense'}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Amount</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-display font-bold">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="pl-8 font-display text-lg font-bold rounded-xl h-12"
                  />
                </div>
              </div>

              {/* Category grid */}
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Category</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {categories.map(c => (
                    <motion.button
                      key={c}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCategory(c)}
                      className={`relative flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all text-center ${category === c
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-transparent bg-muted/50 hover:bg-muted'
                        }`}
                    >
                      <span className="text-xl">{CATEGORY_ICONS[c] || '📦'}</span>
                      <span className="text-[10px] font-medium leading-tight">{c}</span>
                      {category === c && (
                        <motion.div
                          layoutId="category-check"
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Check className="h-2.5 w-2.5 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Description</Label>
                <Input placeholder="What was it for?" value={description} onChange={e => setDescription(e.target.value)} className="mt-1.5 rounded-xl h-11" />
              </div>

              {/* Date */}
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Date</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1.5 rounded-xl h-11" />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-bold text-base shadow-lg hover:shadow-xl transition-all"
              >
                {editId ? '✨ Update' : '✨ Add'} Transaction
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
