import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenses } from '@/context/ExpenseContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/utils/types';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
      toast({ title: 'Updated!', description: 'Transaction updated successfully' });
    } else {
      addTransaction(data);
      toast({ title: 'Added!', description: `${type === 'income' ? 'Income' : 'Expense'} added successfully` });
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
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-card rounded-2xl p-6 z-10"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold">{editId ? 'Edit' : 'Add'} Transaction</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex rounded-lg bg-muted p-1">
                {(['expense', 'income'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setType(t); setCategory(''); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === t ? (t === 'income' ? 'bg-income text-income-foreground' : 'bg-expense text-expense-foreground') : 'text-muted-foreground'}`}
                  >
                    {t === 'income' ? '💰 Income' : '💸 Expense'}
                  </button>
                ))}
              </div>
              <div>
                <Label>Amount</Label>
                <Input type="number" step="0.01" min="0" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 font-display text-lg" />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Input placeholder="What was it for?" value={description} onChange={e => setDescription(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1" />
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">
                {editId ? 'Update' : 'Add'} Transaction
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
