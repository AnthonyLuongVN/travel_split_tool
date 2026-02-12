import { Group, Balance, SimplifiedDebt } from '../types';

/**
 * Calculate net balance for each member
 * Negative balance = member is owed money (creditor)
 * Positive balance = member owes money (debtor)
 */
export const calculateBalances = (group: Group): Map<string, number> => {
  const balances = new Map<string, number>();

  // Initialize all members with 0 balance
  group.members.forEach(member => {
    balances.set(member.id, 0);
  });

  // Process all transactions
  group.transactions.forEach(transaction => {
    // Payer gets negative balance (they're owed money)
    const currentPayerBalance = balances.get(transaction.payerId) || 0;
    balances.set(transaction.payerId, currentPayerBalance - transaction.amount);

    // Each split participant gets positive balance (they owe money)
    transaction.splits.forEach(split => {
      const currentBalance = balances.get(split.memberId) || 0;
      balances.set(split.memberId, currentBalance + split.amount);
    });
  });

  // Process settlements
  group.settlements.forEach(settlement => {
    // Person who paid reduces their debt (or increases what they're owed)
    const currentFromBalance = balances.get(settlement.fromId) || 0;
    balances.set(settlement.fromId, currentFromBalance - settlement.amount);

    // Person who received reduces what they're owed (or increases their debt)
    const currentToBalance = balances.get(settlement.toId) || 0;
    balances.set(settlement.toId, currentToBalance + settlement.amount);
  });

  return balances;
};

/**
 * Simplify debts using greedy algorithm
 * Matches largest creditor with largest debtor to minimize number of transactions
 */
export const simplifyDebts = (balances: Map<string, number>): SimplifiedDebt[] => {
  const result: SimplifiedDebt[] = [];

  // Separate creditors (negative balance) and debtors (positive balance)
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  balances.forEach((balance, memberId) => {
    // Round to 2 decimal places to avoid floating point errors
    const roundedBalance = Math.round(balance * 100) / 100;

    if (roundedBalance < -0.01) {
      // Negative = owed money (creditor)
      creditors.push({ id: memberId, amount: -roundedBalance });
    } else if (roundedBalance > 0.01) {
      // Positive = owes money (debtor)
      debtors.push({ id: memberId, amount: roundedBalance });
    }
  });

  // Sort by amount descending (largest first)
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  // Greedy matching
  let i = 0; // creditor index
  let j = 0; // debtor index

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = Math.min(creditor.amount, debtor.amount);

    if (amount > 0.01) {
      result.push({
        fromId: debtor.id,
        toId: creditor.id,
        amount: Math.round(amount * 100) / 100
      });
    }

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }

  return result;
};

/**
 * Get balances as array for easier rendering
 */
export const getBalancesArray = (group: Group): Balance[] => {
  const balances = calculateBalances(group);
  return Array.from(balances.entries()).map(([memberId, balance]) => ({
    memberId,
    balance: Math.round(balance * 100) / 100
  }));
};

/**
 * Get total spending per member
 */
export const getTotalSpending = (group: Group): Map<string, number> => {
  const spending = new Map<string, number>();

  group.members.forEach(member => {
    spending.set(member.id, 0);
  });

  group.transactions.forEach(transaction => {
    const current = spending.get(transaction.payerId) || 0;
    spending.set(transaction.payerId, current + transaction.amount);
  });

  return spending;
};

/**
 * Get total owed per member
 */
export const getTotalOwed = (group: Group): Map<string, number> => {
  const owed = new Map<string, number>();

  group.members.forEach(member => {
    owed.set(member.id, 0);
  });

  group.transactions.forEach(transaction => {
    transaction.splits.forEach(split => {
      const current = owed.get(split.memberId) || 0;
      owed.set(split.memberId, current + split.amount);
    });
  });

  return owed;
};
