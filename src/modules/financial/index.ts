/**
 * Financial Management Module
 * Manages expenses, income, budgets, loans, and financial planning
 */

import { Module, ModuleCategory, ModuleMetadata } from '../../types/module';
import { DollarSign } from 'lucide-react';

const metadata: ModuleMetadata = {
  id: 'financial',
  name: 'Financial Management',
  description: 'Track expenses, income, budgets, and financial goals',
  version: '1.0.0',
  author: 'ATLAS',
  category: ModuleCategory.FINANCIAL,
  icon: DollarSign,
  enabled: true,
};

export const FinancialModule: Module = {
  metadata,

  async initialize(config) {
    console.log('Financial module initialized with config:', config);
    // Existing financial tracking is already initialized
    // This is just a wrapper for the existing functionality
  },

  async cleanup() {
    console.log('Financial module cleanup');
  },

  getActions() {
    return [
      {
        id: 'add_expense',
        name: 'Add Expense',
        description: 'Record a new expense',
        handler: async (params) => {
          // This will be handled by the existing ExpenseForm
          console.log('Add expense action triggered', params);
        },
      },
      {
        id: 'add_income',
        name: 'Add Income',
        description: 'Record new income',
        handler: async (params) => {
          // This will be handled by the existing IncomeForm
          console.log('Add income action triggered', params);
        },
      },
      {
        id: 'check_budget',
        name: 'Check Budget',
        description: 'Check current budget status',
        handler: async () => {
          console.log('Check budget action triggered');
          // Return budget status
        },
      },
    ];
  },

  async getStatus() {
    return {
      healthy: true,
      message: 'Financial tracking active',
      lastUpdated: new Date(),
      metrics: {
        expensesCount: 0, // Will be populated from actual data
        incomeCount: 0,
      },
    };
  },
};

export default FinancialModule;
