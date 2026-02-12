/**
 * Format currency amount
 * VND uses "k" shorthand: 10,000 → "10k", 150,000 → "150k"
 */
export const formatCurrency = (amount: number, currency: string): string => {
  if ((currency || 'USD') === 'VND') {
    const k = amount / 1000;
    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
    }).format(k);
    return `${formatted}k`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format date for input field
 */
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Get today's date in ISO format
 */
export const getTodayISO = (): string => {
  return new Date().toISOString();
};

/**
 * Generate random color for member
 */
export const generateRandomColor = (): string => {
  const colors = [
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // emerald
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
