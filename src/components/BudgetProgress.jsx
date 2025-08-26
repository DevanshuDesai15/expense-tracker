import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const BudgetProgress = ({ categories, expensesByCategory }) => {
  return (
    <div className="space-y-4">
      {categories.map(category => {
        const spent = expensesByCategory[category.id] || 0;
        const budget = category.budgetAmount;
        const percentage = budget > 0 ? (spent / budget) * 100 : 0;
        const isOverBudget = spent > budget && budget > 0;
        const isOnTrack = percentage <= 80;
        
        return (
          <div key={category.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{category.name}</span>
                {isOverBudget && (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                {isOnTrack && spent > 0 && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="text-right">
                <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                  ${spent.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm ml-1">
                  / ${budget.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isOverBudget 
                    ? 'bg-red-500' 
                    : percentage > 80 
                      ? 'bg-amber-500' 
                      : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
              {percentage > 100 && (
                <div
                  className="h-2 bg-red-600 opacity-75"
                  style={{ width: `${Math.min(percentage - 100, 100)}%` }}
                />
              )}
            </div>
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>{percentage.toFixed(1)}% used</span>
              {budget > 0 && (
                <span className={isOverBudget ? 'text-red-600' : 'text-gray-500'}>
                  ${(budget - spent).toLocaleString()} remaining
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetProgress;