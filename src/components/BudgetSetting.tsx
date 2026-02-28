import { useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { formatCurrency } from '@/utils/helpers';
import { Target } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function BudgetSetting() {
  const { budgetLimit, setBudgetLimit, totalExpenses } = useExpenses();
  const [input, setInput] = useState(budgetLimit > 0 ? budgetLimit.toString() : '');
  const { toast } = useToast();
  const progress = budgetLimit > 0 ? Math.min((totalExpenses / budgetLimit) * 100, 100) : 0;

  const handleSet = () => {
    const val = parseFloat(input);
    if (!val || val <= 0) return;
    setBudgetLimit(val);
    toast({ title: 'Budget set!', description: `Monthly budget set to ${formatCurrency(val)}` });
  };

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold">Budget Limit</h3>
      </div>
      <div className="flex gap-2 mb-4">
        <Input type="number" placeholder="Set monthly budget" value={input} onChange={e => setInput(e.target.value)} className="font-display" />
        <Button onClick={handleSet} className="gradient-primary text-primary-foreground shrink-0">Set</Button>
      </div>
      {budgetLimit > 0 && (
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Spent: {formatCurrency(totalExpenses)}</span>
            <span className="font-medium">{formatCurrency(budgetLimit)}</span>
          </div>
          <Progress value={progress} className={`h-2.5 ${progress >= 100 ? '[&>div]:bg-destructive' : progress >= 80 ? '[&>div]:bg-warning' : '[&>div]:bg-primary'}`} />
        </div>
      )}
    </div>
  );
}
