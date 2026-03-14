import React, { useState, useEffect } from 'react';
import { useGroup } from '../context/GroupContext';
import { Transaction } from '../types';
import { formatDateForInput, getTodayISO } from '../utils/formatters';

interface TransactionFormProps {
  onClose: () => void;
  editTransaction?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, editTransaction }) => {
  const { group, addTransaction, updateTransaction } = useGroup();
  const [amount, setAmount] = useState(editTransaction?.amount.toString() || '');
  const [description, setDescription] = useState(editTransaction?.description || '');
  const [category, setCategory] = useState(editTransaction?.category || 'Food');
  const [date, setDate] = useState(
    editTransaction ? formatDateForInput(editTransaction.date) : formatDateForInput(getTodayISO())
  );
  const [payerId, setPayerId] = useState(editTransaction?.payerId || group?.members[0]?.id || '');
  const [splitMode, setSplitMode] = useState<'equal' | 'custom'>('equal');
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set(editTransaction?.splits.map(s => s.memberId) || [])
  );
  const [customSplits, setCustomSplits] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (editTransaction) {
      const splits = new Map<string, string>();
      editTransaction.splits.forEach(split => {
        splits.set(split.memberId, split.amount.toString());
      });
      setCustomSplits(splits);
      if (editTransaction.splits.length > 0) {
        const firstAmount = editTransaction.splits[0].amount;
        const allEqual = editTransaction.splits.every(s => s.amount === firstAmount);
        setSplitMode(allEqual ? 'equal' : 'custom');
      }
    }
  }, [editTransaction]);

  if (!group) return null;

  const toggleMember = (memberId: string) => {
    const updated = new Set(selectedMembers);
    if (updated.has(memberId)) {
      updated.delete(memberId);
    } else {
      updated.add(memberId);
    }
    setSelectedMembers(updated);
  };

  const updateCustomSplit = (memberId: string, value: string) => {
    const updated = new Map(customSplits);
    updated.set(memberId, value);
    setCustomSplits(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (numAmount > 999_999_999) {
      alert('Amount is too large (max 999,999,999)');
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
      alert('Amount cannot have more than 2 decimal places');
      return;
    }

    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (!payerId) {
      alert('Please select who paid');
      return;
    }

    if (selectedMembers.size === 0) {
      alert('Please select at least one member to split with');
      return;
    }

    let splits: { memberId: string; amount: number }[];

    if (splitMode === 'equal') {
      const splitAmount = numAmount / selectedMembers.size;
      splits = Array.from(selectedMembers).map(memberId => ({
        memberId,
        amount: Math.round(splitAmount * 100) / 100
      }));
    } else {
      // Custom splits
      splits = Array.from(selectedMembers).map(memberId => {
        const customAmount = parseFloat(customSplits.get(memberId) || '0');
        return { memberId, amount: customAmount };
      });

      const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);
      const diff = Math.abs(totalSplit - numAmount);

      if (diff > 0.01) {
        alert(`Split amounts must sum to ${numAmount}. Current total: ${totalSplit.toFixed(2)}`);
        return;
      }
    }

    const transaction: Omit<Transaction, 'id'> = {
      amount: numAmount,
      description: description.trim(),
      category,
      date: new Date(date).toISOString(),
      payerId,
      splits,
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, transaction);
    } else {
      addTransaction(transaction);
    }

    onClose();
  };

  const categories = [
    'Food',
    'Transport',
    'Accommodation',
    'Activities',
    'Shopping',
    'Entertainment',
    'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {editTransaction ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount ({group.currency})
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Dinner at restaurant"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Payer */}
          <div>
            <label htmlFor="payer" className="block text-sm font-medium text-gray-700 mb-2">
              Who Paid?
            </label>
            <select
              id="payer"
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {group.members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Split With */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Split With
            </label>
            <div className="space-y-2">
              {group.members.map(member => (
                <label
                  key={member.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.has(member.id)}
                    onChange={() => toggleMember(member.id)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    style={{ backgroundColor: member.color }}
                  />
                  <span className="flex-1 font-medium">{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Split Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Split Method
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSplitMode('equal')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                  splitMode === 'equal'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Equal Split
              </button>
              <button
                type="button"
                onClick={() => setSplitMode('custom')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                  splitMode === 'custom'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Custom Amounts
              </button>
            </div>
          </div>

          {/* Custom Splits */}
          {splitMode === 'custom' && selectedMembers.size > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">Enter custom amounts:</p>
              <div className="space-y-2">
                {Array.from(selectedMembers).map(memberId => {
                  const member = group.members.find(m => m.id === memberId);
                  if (!member) return null;
                  return (
                    <div key={memberId} className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: member.color }}
                      />
                      <span className="flex-1 text-sm">{member.name}</span>
                      <input
                        type="number"
                        step="0.01"
                        value={customSplits.get(memberId) || ''}
                        onChange={(e) => updateCustomSplit(memberId, e.target.value)}
                        placeholder="0.00"
                        className="w-24 px-3 py-1 border border-gray-300 rounded"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {editTransaction ? 'Update' : 'Add'} Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
