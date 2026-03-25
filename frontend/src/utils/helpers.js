export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const CATEGORY_ICONS = {
  // Income
  Salary: '💼',
  Freelancing: '💻',
  Investments: '📈',
  'E-commerce Sales': '🛒',
  'Interest from Savings': '🏦',
  'Graphic Design': '🎨',
  'Affiliate Marketing': '📢',
  Stocks: '📊',
  'Rental Income': '🏠',
  // Expense
  Shopping: '🛍️',
  Travel: '✈️',
  'Electricity Bill': '💡',
  'Loan Repayment': '🏛️',
  Food: '🍔',
  Entertainment: '🎬',
  Healthcare: '🏥',
  Education: '📚',
  Rent: '🏠',
  Utilities: '⚡',
  Other: '💰',
};

export const INCOME_CATEGORIES = [
  'Salary', 'Freelancing', 'Investments', 'E-commerce Sales',
  'Interest from Savings', 'Graphic Design', 'Affiliate Marketing',
  'Stocks', 'Rental Income', 'Other',
];

export const EXPENSE_CATEGORIES = [
  'Shopping', 'Travel', 'Electricity Bill', 'Loan Repayment',
  'Food', 'Entertainment', 'Healthcare', 'Education',
  'Rent', 'Utilities', 'Other',
];
