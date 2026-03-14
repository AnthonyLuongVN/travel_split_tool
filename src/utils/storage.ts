import { z } from 'zod';
import { Group } from '../types';

const STORAGE_KEY = 'vacation-expense-tracker-group';

const SplitSchema = z.object({
  memberId: z.string(),
  amount: z.number(),
});

const MemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  category: z.string(),
  date: z.string(),
  payerId: z.string(),
  splits: z.array(SplitSchema),
});

const SettlementSchema = z.object({
  id: z.string(),
  fromId: z.string(),
  toId: z.string(),
  amount: z.number(),
  date: z.string(),
  note: z.string().optional(),
});

const GroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: z.string(),
  members: z.array(MemberSchema),
  transactions: z.array(TransactionSchema),
  settlements: z.array(SettlementSchema),
  createdAt: z.string(),
});

const logError = (message: string, error: unknown) => {
  const isProd = location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
  const detail = isProd ? (error instanceof Error ? error.message : String(error)) : error;
  console.error(message, detail);
};

export const saveGroup = (group: Group): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(group));
  } catch (error) {
    logError('Failed to save group to localStorage:', error);
  }
};

export const loadGroup = (): Group | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return GroupSchema.parse(parsed) as Group;
  } catch (error) {
    logError('Failed to load group from localStorage:', error);
    return null;
  }
};

export const clearGroup = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    logError('Failed to clear group from localStorage:', error);
  }
};
