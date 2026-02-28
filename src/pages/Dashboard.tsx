import { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '@/components/Header';
import BalanceCards from '@/components/BalanceCards';
import Charts from '@/components/Charts';
import TransactionList from '@/components/TransactionList';
import TransactionModal from '@/components/TransactionModal';
import BudgetSetting from '@/components/BudgetSetting';

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6 pb-24">
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
      <button onClick={() => setModalOpen(true)} className="fab-button" aria-label="Add transaction">
        <Plus className="h-6 w-6" />
      </button>

      <TransactionModal open={modalOpen} onClose={handleClose} editId={editId} />
    </div>
  );
}
