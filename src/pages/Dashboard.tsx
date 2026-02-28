import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import BalanceCards from '@/components/BalanceCards';
import Charts from '@/components/Charts';
import TransactionList from '@/components/TransactionList';
import TransactionModal from '@/components/TransactionModal';
import BudgetSetting from '@/components/BudgetSetting';

function ParticleBackground() {
  const particles = [
    { w: 180, h: 180, top: '10%', left: '5%', duration: '12s', delay: '0s' },
    { w: 120, h: 120, top: '60%', right: '8%', duration: '10s', delay: '2s' },
    { w: 80, h: 80, top: '30%', right: '20%', duration: '8s', delay: '1s' },
    { w: 200, h: 200, bottom: '10%', left: '15%', duration: '14s', delay: '3s' },
    { w: 60, h: 60, top: '50%', left: '50%', duration: '9s', delay: '4s' },
  ];
  return (
    <div className="particle-bg">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: p.w,
            height: p.h,
            top: p.top,
            left: p.left,
            right: (p as any).right,
            bottom: (p as any).bottom,
            '--duration': p.duration,
            '--delay': p.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditId(id);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Header />

      <main className="container py-6 space-y-6 pb-24 relative z-10">
        {/* Date line */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <span className="text-sm text-muted-foreground">{dateStr}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        </motion.div>

        <BalanceCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <TransactionList onEdit={handleEdit} />
          </div>
          <BudgetSetting />
        </div>

        <Charts />
      </main>

      {/* FAB */}
      <motion.button
        onClick={() => setModalOpen(true)}
        className="fab-button"
        aria-label="Add transaction"
        whileHover={{ scale: 1.15, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      <TransactionModal open={modalOpen} onClose={handleClose} editId={editId} />
    </div>
  );
}
