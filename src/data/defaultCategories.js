export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: "rent", name: "Rent", budgetAmount: 1600 },
  { id: "groceries", name: "Groceries", budgetAmount: 500 },
  { id: "car-payment", name: "Car Payment", budgetAmount: 300 },
  { id: "miscellaneous", name: "Miscellaneous", budgetAmount: 300 },
  { id: "shopping", name: "Shopping", budgetAmount: 125 },
  { id: "dining", name: "Dining", budgetAmount: 120 },
  { id: "gas-for-car", name: "Gas for Car", budgetAmount: 100 },
  { id: "gas-electric", name: "Gas and Electric", budgetAmount: 50 },
  { id: "coffee", name: "Coffee", budgetAmount: 50 },
  { id: "cell-phone", name: "Cell Phone Bill", budgetAmount: 50 },
  { id: "water", name: "Water", budgetAmount: 30 },
  { id: "sewage", name: "Sewage", budgetAmount: 30 },
  { id: "gym", name: "Gym", budgetAmount: 30 },
  { id: "internet", name: "Internet", budgetAmount: 30 },
  { id: "parking", name: "Parking", budgetAmount: 25 },
  { id: "spotify", name: "Spotify", budgetAmount: 15 },
  { id: "icloud", name: "Apple iCloud", budgetAmount: 15 },
  { id: "netflix", name: "Netflix", budgetAmount: 15 },
  { id: "apple-tv", name: "Apple TV", budgetAmount: 15 },
  { id: "other", name: "Other", budgetAmount: 0 },
];

export const INCOME_SOURCES = [
  { id: "paycheck-1", name: "Job Paycheck 1", expectedAmount: 2000 },
  { id: "paycheck-2", name: "Job Paycheck 2", expectedAmount: 2000 },
  { id: "freelance", name: "Freelance Income", expectedAmount: 0 },
  { id: "other-income", name: "Other Income", expectedAmount: 0 },
];

export const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Check",
  "Digital Wallet",
];

export const CASH_BACK_RATES = [
  { label: "0%", value: 0 },
  { label: "1%", value: 0.01 },
  { label: "1.5%", value: 0.015 },
  { label: "2%", value: 0.02 },
  { label: "3%", value: 0.03 },
  { label: "5%", value: 0.05 },
];

export const SAVINGS_DESTINATIONS = [
  {
    id: "roth-ira",
    name: "Roth IRA",
    description: "Tax-free retirement growth",
    icon: "🏦",
  },
  {
    id: "traditional-401k",
    name: "Traditional 401(k)",
    description: "Employer-sponsored retirement",
    icon: "🏢",
  },
  {
    id: "high-yield-savings",
    name: "High Yield Savings Account",
    description: "Emergency fund & short-term goals",
    icon: "💰",
  },
  {
    id: "investment-account",
    name: "Investment Account",
    description: "Stocks, bonds, and mutual funds",
    icon: "📈",
  },
  {
    id: "emergency-fund",
    name: "Emergency Fund",
    description: "3-6 months of expenses",
    icon: "🛡️",
  },
  {
    id: "vacation-fund",
    name: "Vacation Fund",
    description: "Travel and leisure savings",
    icon: "✈️",
  },
  {
    id: "house-down-payment",
    name: "House Down Payment",
    description: "Future home purchase",
    icon: "🏠",
  },
  {
    id: "education-fund",
    name: "Education Fund",
    description: "Learning and development",
    icon: "🎓",
  },
  {
    id: "other-savings",
    name: "Other Savings",
    description: "Custom savings goal",
    icon: "🎯",
  },
];

export const CREDIT_CARD_TYPES = [
  {
    id: "chase-sapphire-preferred",
    name: "Chase Sapphire Preferred",
    cashBackRates: {
      dining: 0.02,
      travel: 0.02,
      default: 0.01,
    },
    rewardType: "points",
  },
  {
    id: "chase-freedom-flex",
    name: "Chase Freedom Flex",
    cashBackRates: {
      groceries: 0.05, // rotating category
      default: 0.01,
    },
    rewardType: "cash",
  },
  {
    id: "amex-blue-cash-preferred",
    name: "American Express Blue Cash Preferred",
    cashBackRates: {
      groceries: 0.06,
      "gas-for-car": 0.03,
      default: 0.01,
    },
    rewardType: "cash",
  },
  {
    id: "citi-double-cash",
    name: "Citi Double Cash",
    cashBackRates: {
      default: 0.02,
    },
    rewardType: "cash",
  },
  {
    id: "discover-it",
    name: "Discover it",
    cashBackRates: {
      rotating: 0.05, // changes quarterly
      default: 0.01,
    },
    rewardType: "cash",
  },
  {
    id: "capital-one-savor",
    name: "Capital One SavorOne",
    cashBackRates: {
      dining: 0.03,
      entertainment: 0.03,
      groceries: 0.03,
      default: 0.01,
    },
    rewardType: "cash",
  },
  {
    id: "custom-card",
    name: "Custom Card",
    cashBackRates: {
      default: 0.01,
    },
    rewardType: "cash",
  },
];
