import React, { useState } from 'react';
import { useGroup } from '../context/GroupContext';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import TransactionForm from './TransactionForm';

const TransactionList: React.FC = () => {
  const { group, deleteTransaction } = useGroup();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterMember, setFilterMember] = useState<string>('All');

  if (!group) return null;

  const categories = ['All', ...Array.from(new Set(group.transactions.map(t => t.category)))];

  const filteredTransactions = group.transactions.filter(transaction => {
    const categoryMatch = filterCategory === 'All' || transaction.category === filterCategory;
    const memberMatch = filterMember === 'All' ||
      transaction.payerId === filterMember ||
      transaction.splits.some(s => s.memberId === filterMember);
    return categoryMatch && memberMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Member
            </label>
            <select
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              {group.members.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </span>
          <span className="text-xl font-bold text-blue-900">
            Total: {formatCurrency(totalAmount, group.currency)}
          </span>
        </div>
      </div>

      {/* Transaction List */}
      {sortedTransactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No transactions yet</p>
          <p className="text-sm text-gray-400 mt-2">Click the + button to add an expense</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTransactions.map(transaction => {
            const payer = group.members.find(m => m.id === transaction.payerId);
            const splitMembers = transaction.splits.map(s =>
              group.members.find(m => m.id === s.memberId)
            ).filter(Boolean);

            return (
              <div
                key={transaction.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {transaction.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(transaction.amount, group.currency)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span>Paid by</span>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: payer?.color }}
                      />
                      <span className="font-medium">{payer?.name}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {splitMembers.map((member, index) => {
                      if (!member) return null;
                      const split = transaction.splits[index];
                      return (
                        <div
                          key={member.id}
                          className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: member.color }}
                          />
                          <span>{member.name}:</span>
                          <span className="font-medium">
                            {formatCurrency(split.amount, group.currency)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingTransaction && (
        <TransactionForm
          editTransaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
};

export default TransactionList;
