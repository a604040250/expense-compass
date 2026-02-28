import { useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { formatCurrency } from '@/utils/helpers';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

function getMotivation(progress: number): { message: string; color: string; icon: typeof TrendingUp } {
  if (progress === 0) return { message: 'Set a budget to start tracking!', color: 'text-muted-foreground', icon: Minus };
  if (progress < 50) return { message: 'Great job! You\'re well within budget 🎉', color: 'text-green-500', icon: TrendingDown };
  if (progress < 80) return { message: 'Moderate spending, keep an eye on it 👀', color: 'text-amber-500', icon: Minus };
  if (progress < 100) return { message: 'Approaching your limit, be careful! ⚠️', color: 'text-orange-500', icon: TrendingUp };
  return { message: 'Budget exceeded! Time to cut back 🚫', color: 'text-rose-500', icon: TrendingUp };
}

function CircularProgress({ progress, size = 120, strokeWidth = 10 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  const getColor = () => {
    if (progress >= 100) return 'hsl(0, 72%, 51%)';
    if (progress >= 80) return 'hsl(38, 92%, 50%)';
    return 'hsl(160, 84%, 39%)';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="circular-progress">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${getColor()}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold">{Math.round(progress)}%</span>
        <span className="text-[10px] text-muted-foreground font-medium">used</span>
      </div>
    </div>
  );
}

export default function BudgetSetting() {
  const { budgetLimit, setBudgetLimit, totalExpenses } = useExpenses();
  const [input, setInput] = useState(budgetLimit > 0 ? budgetLimit.toString() : '');
  const { toast } = useToast();
  const progress = budgetLimit > 0 ? (totalExpenses / budgetLimit) * 100 : 0;
  const motivation = getMotivation(progress);

  const handleSet = () => {
    const val = parseFloat(input);
    if (!val || val <= 0) return;
    setBudgetLimit(val);
    toast({ title: '🎯 Budget set!', description: `Monthly budget set to ${formatCurrency(val)}` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card-glow rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Target className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold">Budget Limit</h3>
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-display font-bold text-sm">$</span>
          <Input
            type="number"
            placeholder="Set monthly budget"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="pl-7 font-display rounded-xl h-11"
          />
        </div>
        <Button onClick={handleSet} className="gradient-primary text-primary-foreground font-semibold rounded-xl shrink-0 h-11 px-5">
          Set
        </Button>
      </div>

      {/* Circular progress */}
      {budgetLimit > 0 && (
        <div className="flex flex-col items-center gap-3">
          <CircularProgress progress={progress} />

          {/* Stats */}
          <div className="w-full flex justify-between text-sm mt-1">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Spent</p>
              <p className="font-display font-bold">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="font-display font-bold">
                {formatCurrency(Math.max(budgetLimit - totalExpenses, 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="font-display font-bold">{formatCurrency(budgetLimit)}</p>
            </div>
          </div>

          {/* Motivation */}
          <div className={`flex items-center gap-1.5 text-xs font-medium ${motivation.color} mt-1`}>
            <motivation.icon className="h-3 w-3" />
            <span>{motivation.message}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
