import React, { useState } from 'react';
import { useGroup } from '../context/GroupContext';
import { formatCurrency, getTodayISO } from '../utils/formatters';

interface SettlementButtonProps {
  fromId: string;
  toId: string;
  amount: number;
  onClose: () => void;
}

const SettlementButton: React.FC<SettlementButtonProps> = ({ fromId, toId, amount, onClose }) => {
  const { group, addSettlement } = useGroup();
  const [note, setNote] = useState('');

  if (!group) return null;

  const fromMember = group.members.find(m => m.id === fromId);
  const toMember = group.members.find(m => m.id === toId);

  if (!fromMember || !toMember) return null;

  const handleConfirm = () => {
    addSettlement({
      fromId,
      toId,
      amount,
      date: getTodayISO(),
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Payment</h2>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: fromMember.color }}
              />
              <span className="font-medium">{fromMember.name}</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: toMember.color }}
              />
              <span className="font-medium">{toMember.name}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-900">
              {formatCurrency(amount, group.currency)}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Note (optional)
          </label>
          <input
            id="note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Cash payment, Venmo, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettlementButton;
