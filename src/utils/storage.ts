import { Group } from '../types';

const STORAGE_KEY = 'vacation-expense-tracker-group';

export const saveGroup = (group: Group): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(group));
  } catch (error) {
    console.error('Failed to save group to localStorage:', error);
  }
};

export const loadGroup = (): Group | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as Group;
  } catch (error) {
    console.error('Failed to load group from localStorage:', error);
    return null;
  }
};

export const clearGroup = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear group from localStorage:', error);
  }
};
