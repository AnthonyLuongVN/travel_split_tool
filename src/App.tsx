import React, { useState } from 'react';
import { useGroup } from './context/GroupContext';
import GroupSetup from './components/GroupSetup';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BalanceSummary from './components/BalanceSummary';
import PivotTable from './components/PivotTable';
import MembersPanel from './components/MembersPanel';

type Tab = 'transactions' | 'balances' | 'pivot' | 'members';

const App: React.FC = () => {
  const { group, clearGroup } = useGroup();
  const [activeTab, setActiveTab] = useState<Tab>('transactions');
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  if (!group) {
    return <GroupSetup />;
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start a new trip? This will delete all current data.')) {
      clearGroup();
    }
  };

  const csvEscape = (value: string | number | undefined): string => {
    const str = String(value ?? '');
    // Neutralize formula injection: prefix dangerous chars with a tab
    const safe = /^[=+\-@]/.test(str) ? `\t${str}` : str;
    // Wrap in quotes and escape internal quotes per RFC 4180
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const exportToCSV = () => {
    let csv = 'Date,Description,Category,Payer,Amount,Split With,Split Amount\n';

    group.transactions.forEach(transaction => {
      const payer = group.members.find(m => m.id === transaction.payerId);
      transaction.splits.forEach(split => {
        const member = group.members.find(m => m.id === split.memberId);
        csv += `${csvEscape(transaction.date)},${csvEscape(transaction.description)},${csvEscape(transaction.category)},${csvEscape(payer?.name)},${csvEscape(transaction.amount)},${csvEscape(member?.name)},${csvEscape(split.amount)}\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${group.name}-expenses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const tabs: { id: Tab; label: string; shortLabel: string }[] = [
    { id: 'transactions', label: 'Expenses', shortLabel: 'Expenses' },
    { id: 'balances', label: 'Balances', shortLabel: 'Balances' },
    { id: 'pivot', label: 'Matrix', shortLabel: 'Matrix' },
    { id: 'members', label: 'Members', shortLabel: 'Members' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {/* Title row */}
          <div className="flex justify-between items-center mb-3">
            <div className="min-w-0 flex-1 mr-2">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate leading-tight">
                {group.name}
              </h1>
              <p className="text-xs text-gray-500">
                {group.members.length} members · {group.currency}
              </p>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={exportToCSV}
                className="px-2 sm:px-4 py-2 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors whitespace-nowrap"
                title="Export CSV"
              >
                <span className="hidden sm:inline">Export </span>CSV
              </button>
              <button
                onClick={handleReset}
                className="px-2 sm:px-4 py-2 text-xs sm:text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors whitespace-nowrap"
                title="Start new trip"
              >
                <span className="hidden sm:inline">New Trip</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 sm:gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 sm:py-3 px-1 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24">
        {activeTab === 'transactions' && <TransactionList />}
        {activeTab === 'balances' && <BalanceSummary />}
        {activeTab === 'pivot' && <PivotTable />}
        {activeTab === 'members' && <MembersPanel />}
      </main>

      {/* Floating Action Button — visible on transactions tab */}
      {activeTab === 'transactions' && (
        <button
          onClick={() => setShowAddTransaction(true)}
          className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-all hover:scale-110 flex items-center justify-center text-3xl"
          style={{ zIndex: 50 }}
          aria-label="Add transaction"
        >
          +
        </button>
      )}

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <TransactionForm onClose={() => setShowAddTransaction(false)} />
      )}
    </div>
  );
};

export default App;
