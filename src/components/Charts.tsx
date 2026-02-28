import { useMemo } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { CATEGORY_ICONS } from '@/utils/types';
import { formatCurrency } from '@/utils/helpers';
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

/* eslint-disable @typescript-eslint/no-explicit-any */
function GlassTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-3 shadow-xl border border-white/10">
      {label && <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function Charts() {
  const { transactions } = useExpenses();

  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, icon: CATEGORY_ICONS[name] || '', value }));
  }, [transactions]);

  const barData = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!map[month]) map[month] = { income: 0, expense: 0 };
      map[month][t.type] += t.amount;
    });
    return Object.entries(map).map(([month, data]) => ({ month, ...data })).slice(-6);
  }, [transactions]);

  if (transactions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {pieData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-glow rounded-2xl p-5"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15">
              <PieChartIcon className="h-4 w-4 text-violet-500" />
            </div>
            <h3 className="font-display text-lg font-semibold">Expense Breakdown</h3>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<GlassTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 group cursor-default">
                <span
                  className="w-3 h-3 rounded-full shadow-sm transition-transform group-hover:scale-125"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs font-medium">
                  {d.icon} {d.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(d.value)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {barData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card-glow rounded-2xl p-5"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15">
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </div>
            <h3 className="font-display text-lg font-semibold">Monthly Overview</h3>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barGap={4}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fontWeight: 500 }}
                stroke="hsl(var(--muted-foreground))"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<GlassTooltip />} />
              <Bar dataKey="income" fill="url(#incomeGradient)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="url(#expenseGradient)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-3 justify-center">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-xs font-medium">Expense</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
