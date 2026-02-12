import React, { useState } from 'react';
import { useGroup } from '../context/GroupContext';
import { formatCurrency } from '../utils/formatters';
import { calculateBalances, simplifyDebts, getTotalSpending, getTotalOwed } from '../utils/calculations';
import SettlementButton from './SettlementButton';

const BalanceSummary: React.FC = () => {
  const { group } = useGroup();
  const [showSettlement, setShowSettlement] = useState<{ fromId: string; toId: string; amount: number } | null>(null);

  if (!group) return null;

  const balances = calculateBalances(group);
  const simplifiedDebts = simplifyDebts(balances);
  const totalSpending = getTotalSpending(group);
  const totalOwed = getTotalOwed(group);

  const totalExpenses = group.transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-lg font-semibold mb-2">Total Trip Expenses</h2>
        <div className="text-4xl font-bold">{formatCurrency(totalExpenses, group.currency)}</div>
        <p className="text-blue-100 mt-2">{group.transactions.length} transactions</p>
      </div>

      {/* Member Balances */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Breakdown</h3>
        <div className="space-y-3">
          {group.members.map(member => {
            const balance = balances.get(member.id) || 0;
            const spent = totalSpending.get(member.id) || 0;
            const owed = totalOwed.get(member.id) || 0;
            const isCreditor = balance < -0.01;

            return (
              <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{ backgroundColor: member.color }}
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">
                        Spent: {formatCurrency(spent, group.currency)} •
                        Owes: {formatCurrency(owed, group.currency)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {Math.abs(balance) < 0.01 ? (
                      <div className="text-green-600 font-semibold">Settled up</div>
                    ) : isCreditor ? (
                      <div>
                        <div className="text-green-600 font-semibold">
                          Gets back {formatCurrency(-balance, group.currency)}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-red-600 font-semibold">
                          Owes {formatCurrency(balance, group.currency)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simplified Debts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Who Owes Who</h3>
        <p className="text-sm text-gray-600 mb-4">
          Simplified payment plan to settle all debts
        </p>

        {simplifiedDebts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-2">✓</div>
            <p className="text-green-600 font-semibold">All settled up!</p>
            <p className="text-sm text-gray-500 mt-1">No outstanding payments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {simplifiedDebts.map((debt, index) => {
              const fromMember = group.members.find(m => m.id === debt.fromId);
              const toMember = group.members.find(m => m.id === debt.toId);

              if (!fromMember || !toMember) return null;

              return (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: fromMember.color }}
                      />
                      <span className="font-medium">{fromMember.name}</span>
                      <span className="text-gray-400">→</span>
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: toMember.color }}
                      />
                      <span className="font-medium">{toMember.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(debt.amount, group.currency)}
                      </div>
                      <button
                        onClick={() => setShowSettlement(debt)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Mark as Paid
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Settlement History */}
      {group.settlements.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
          <div className="space-y-2">
            {group.settlements.map(settlement => {
              const fromMember = group.members.find(m => m.id === settlement.fromId);
              const toMember = group.members.find(m => m.id === settlement.toId);

              if (!fromMember || !toMember) return null;

              return (
                <div key={settlement.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: fromMember.color }}
                    />
                    <span>{fromMember.name}</span>
                    <span className="text-gray-400">→</span>
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: toMember.color }}
                    />
                    <span>{toMember.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatCurrency(settlement.amount, group.currency)}</span>
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settlement Modal */}
      {showSettlement && (
        <SettlementButton
          fromId={showSettlement.fromId}
          toId={showSettlement.toId}
          amount={showSettlement.amount}
          onClose={() => setShowSettlement(null)}
        />
      )}
    </div>
  );
};

export default BalanceSummary;
