import { useMemo } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { CATEGORY_ICONS } from '@/utils/types';
import { formatCurrency } from '@/utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function Charts() {
  const { transactions } = useExpenses();

  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name: `${CATEGORY_ICONS[name] || ''} ${name}`, value }));
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
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display text-lg font-semibold mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.map((d, i) => (
              <span key={i} className="text-xs flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      )}
      {barData.length > 0 && (
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display text-lg font-semibold mb-4">Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)' }} />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
