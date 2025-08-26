import React, { useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  Calendar,
  Target,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import ExpenseChart from './ExpenseChart';
import BudgetProgress from './BudgetProgress';
import { DEFAULT_EXPENSE_CATEGORIES } from '../data/defaultCategories';

const Dashboard = ({ expenses, incomeEntries }) => {
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  
  const currentMonth = useMemo(() => {
    const now = new Date();
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
      name: format(now, 'MMMM yyyy')
    };
  }, []);

  const monthlyStats = useMemo(() => {
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= currentMonth.start && expenseDate <= currentMonth.end;
    });

    const monthlyIncome = incomeEntries.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate >= currentMonth.start && incomeDate <= currentMonth.end;
    });

    const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = monthlyIncome.reduce((sum, income) => sum + income.amount, 0);
    const totalBudget = DEFAULT_EXPENSE_CATEGORIES.reduce((sum, cat) => sum + cat.budgetAmount, 0);
    
    const profit = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;
    
    return {
      totalExpenses,
      totalIncome,
      totalBudget,
      profit,
      savingsRate,
      monthlyExpenses,
      monthlyIncome
    };
  }, [expenses, incomeEntries, currentMonth]);

  const expensesByCategory = useMemo(() => {
    const categoryTotals = {};
    monthlyStats.monthlyExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    return categoryTotals;
  }, [monthlyStats.monthlyExpenses]);

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-500 text-blue-100',
      green: 'bg-green-500 text-green-100',
      red: 'bg-red-500 text-red-100',
      amber: 'bg-amber-500 text-amber-100'
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              ${typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {trend && (
              <p className={`text-xs mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.positive ? <TrendingUp className="inline w-3 h-3 mr-1" /> : <TrendingDown className="inline w-3 h-3 mr-1" />}
                {trend.value}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  const hasData = expenses.length > 0 || incomeEntries.length > 0;
  const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Your financial overview for {currentMonth.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          {hasCompletedOnboarding && (
            <button
              onClick={() => setShowOnboarding(true)}
              className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Take Tour</span>
            </button>
          )}
          <div className="flex items-center space-x-2 text-gray-500">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{currentMonth.name}</span>
          </div>
        </div>
      </div>

      {/* Welcome Message for New Users */}
      {!hasData && hasCompletedOnboarding && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome to FinanceTracker! 🎉
              </h3>
              <p className="text-gray-600 mb-4">
                You're all set up! Start by adding your first expense or income entry to see your financial data come to life.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  <span>Add First Expense</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <span>Add Income Source</span>
                </button>
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Take Tour Again</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Income"
          value={monthlyStats.totalIncome}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Monthly Expenses"
          value={monthlyStats.totalExpenses}
          icon={TrendingDown}
          color="red"
        />
        <StatCard
          title="Monthly Profit"
          value={monthlyStats.profit}
          icon={PiggyBank}
          color={monthlyStats.profit >= 0 ? 'green' : 'red'}
        />
        <StatCard
          title="Savings Rate"
          value={`${monthlyStats.savingsRate.toFixed(1)}%`}
          icon={Target}
          color="blue"
        />
      </div>

      {/* Budget vs Actual */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget vs Actual</h2>
        <BudgetProgress 
          categories={DEFAULT_EXPENSE_CATEGORIES}
          expensesByCategory={expensesByCategory}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Spending by Category</h2>
          <ExpenseChart 
            data={expensesByCategory}
            categories={DEFAULT_EXPENSE_CATEGORIES}
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="font-medium text-green-900">Total Budget</span>
              <span className="font-bold text-green-900">${monthlyStats.totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-900">Actual Expenses</span>
              <span className="font-bold text-blue-900">${monthlyStats.totalExpenses.toLocaleString()}</span>
            </div>
            <div className={`flex justify-between items-center p-4 rounded-lg ${
              monthlyStats.totalExpenses <= monthlyStats.totalBudget ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <span className={`font-medium ${
                monthlyStats.totalExpenses <= monthlyStats.totalBudget ? 'text-green-900' : 'text-red-900'
              }`}>
                Budget Remaining
              </span>
              <span className={`font-bold ${
                monthlyStats.totalExpenses <= monthlyStats.totalBudget ? 'text-green-900' : 'text-red-900'
              }`}>
                ${(monthlyStats.totalBudget - monthlyStats.totalExpenses).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Quick Tour</h2>
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Need a refresher? You can always retake the onboarding tour from the help menu or by clicking the "Take Tour" button.
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem('onboarding-completed');
                  window.location.reload();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Restart Onboarding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;