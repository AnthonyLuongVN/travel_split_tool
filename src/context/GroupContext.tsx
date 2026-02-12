import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Group, Member, Transaction, Settlement } from '../types';
import { saveGroup, loadGroup, clearGroup as clearStorageGroup } from '../utils/storage';
import { generateId, getTodayISO } from '../utils/formatters';

interface GroupContextType {
  group: Group | null;
  createGroup: (name: string, currency: string, members: Omit<Member, 'id'>[]) => void;
  addMember: (member: Omit<Member, 'id'>) => void;
  removeMember: (memberId: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addSettlement: (settlement: Omit<Settlement, 'id'>) => void;
  clearGroup: () => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [group, setGroup] = useState<Group | null>(null);

  // Load group from localStorage on mount
  useEffect(() => {
    const loaded = loadGroup();
    if (loaded) {
      setGroup(loaded);
    }
  }, []);

  // Save group to localStorage whenever it changes
  useEffect(() => {
    if (group) {
      saveGroup(group);
    }
  }, [group]);

  const createGroup = (name: string, currency: string, members: Omit<Member, 'id'>[]) => {
    const newGroup: Group = {
      id: generateId(),
      name,
      currency,
      members: members.map(m => ({ ...m, id: generateId() })),
      transactions: [],
      settlements: [],
      createdAt: getTodayISO(),
    };
    setGroup(newGroup);
  };

  const addMember = (member: Omit<Member, 'id'>) => {
    if (!group) return;
    setGroup({
      ...group,
      members: [...group.members, { ...member, id: generateId() }],
    });
  };

  const removeMember = (memberId: string) => {
    if (!group) return;
    setGroup({
      ...group,
      members: group.members.filter(m => m.id !== memberId),
    });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    if (!group) return;
    setGroup({
      ...group,
      transactions: [...group.transactions, { ...transaction, id: generateId() }],
    });
  };

  const updateTransaction = (id: string, transaction: Omit<Transaction, 'id'>) => {
    if (!group) return;
    setGroup({
      ...group,
      transactions: group.transactions.map(t =>
        t.id === id ? { ...transaction, id } : t
      ),
    });
  };

  const deleteTransaction = (id: string) => {
    if (!group) return;
    setGroup({
      ...group,
      transactions: group.transactions.filter(t => t.id !== id),
    });
  };

  const addSettlement = (settlement: Omit<Settlement, 'id'>) => {
    if (!group) return;
    setGroup({
      ...group,
      settlements: [...group.settlements, { ...settlement, id: generateId() }],
    });
  };

  const clearGroup = () => {
    clearStorageGroup();
    setGroup(null);
  };

  return (
    <GroupContext.Provider
      value={{
        group,
        createGroup,
        addMember,
        removeMember,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addSettlement,
        clearGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};
