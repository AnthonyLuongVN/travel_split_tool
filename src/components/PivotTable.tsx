import React from 'react';
import { useGroup } from '../context/GroupContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const PivotTable: React.FC = () => {
  const { group } = useGroup();
  if (!group) return null;

  if (group.transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No transactions yet</p>
        <p className="text-sm text-gray-400 mt-2">Click the + button to add an expense</p>
      </div>
    );
  }

  const sortedTransactions = [...group.transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Per-member column totals
  const memberTotals: Record<string, number> = {};
  group.members.forEach(m => { memberTotals[m.id] = 0; });
  sortedTransactions.forEach(t => {
    t.splits.forEach(s => {
      memberTotals[s.memberId] = (memberTotals[s.memberId] || 0) + s.amount;
    });
  });

  const grandTotal = sortedTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-xs text-gray-500">
          <span className="font-bold text-green-600">*</span> = paid for this row
        </span>
        <span className="text-xs text-gray-400">Scroll right to see all members →</span>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                {/* Sticky first column */}
                <th className="text-left p-3 font-semibold text-gray-700 sticky left-0 z-10 bg-gray-50 border-r border-gray-200 min-w-[130px]">
                  Transaction
                </th>
                <th className="text-right p-3 font-semibold text-gray-700 whitespace-nowrap bg-blue-50">
                  Total
                </th>
                {group.members.map(member => (
                  <th key={member.id} className="text-right p-3 font-semibold text-gray-700 whitespace-nowrap min-w-[90px]">
                    <div className="flex items-center justify-end gap-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: member.color }}
                      />
                      <span>{member.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sortedTransactions.map((transaction, idx) => {
                const payer = group.members.find(m => m.id === transaction.payerId);
                const rowBg = idx % 2 === 0 ? 'white' : '#f9fafb';

                return (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    {/* Sticky description cell */}
                    <td
                      className="p-3 sticky left-0 z-10 border-r border-gray-200"
                      style={{ backgroundColor: rowBg }}
                    >
                      <div className="font-medium text-gray-900 leading-tight text-xs sm:text-sm">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {formatDate(transaction.date)}
                      </div>
                      <div className="text-xs mt-0.5 flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: payer?.color }}
                        />
                        <span className="text-gray-400">{payer?.name}</span>
                      </div>
                    </td>

                    {/* Total column */}
                    <td className="p-3 text-right font-semibold text-gray-900 whitespace-nowrap bg-blue-50 bg-opacity-40">
                      {formatCurrency(transaction.amount, group.currency)}
                    </td>

                    {/* Per-member split columns */}
                    {group.members.map(member => {
                      const split = transaction.splits.find(s => s.memberId === member.id);
                      const isPayer = transaction.payerId === member.id;

                      return (
                        <td key={member.id} className="p-3 text-right whitespace-nowrap">
                          {split ? (
                            <span className={isPayer ? 'font-semibold' : 'text-gray-700'}>
                              {isPayer && (
                                <span className="text-green-600 text-xs font-bold mr-0.5">*</span>
                              )}
                              {formatCurrency(split.amount, group.currency)}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="bg-blue-50 border-t-2 border-blue-300 font-bold">
                <td className="p-3 text-gray-900 sticky left-0 z-10 bg-blue-100 border-r border-blue-200">
                  <span className="text-sm">Grand Total</span>
                </td>
                <td className="p-3 text-right text-blue-900 whitespace-nowrap bg-blue-100">
                  {formatCurrency(grandTotal, group.currency)}
                </td>
                {group.members.map(member => (
                  <td key={member.id} className="p-3 text-right text-blue-900 whitespace-nowrap">
                    {formatCurrency(memberTotals[member.id] || 0, group.currency)}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PivotTable;
