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
import { useCategories } from '../hooks/useCategories';

const Dashboard = ({ expenses, incomeEntries, monthlyStats }) => {
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const { allCategories } = useCategories();

  const currentMonth = useMemo(() => {
    const now = new Date();
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
      name: format(now, 'MMMM yyyy')
    };
  }, []);

  // monthlyStats is now passed as a prop from App.tsx

  const expensesByCategory = useMemo(() => {
    const categoryTotals = {};
    monthlyStats.monthlyExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    return categoryTotals;
  }, [monthlyStats.monthlyExpenses]);

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue', showCurrency = true }) => {
    const colorClasses = {
      blue: 'bg-blue-600 text-blue-200',
      green: 'bg-green-600 text-green-200',
      red: 'bg-red-600 text-red-200',
      amber: 'bg-amber-600 text-amber-200'
    };

    const formatValue = () => {
      if (typeof value === 'number' && showCurrency) {
        return `$${value.toLocaleString()}`;
      }
      return typeof value === 'number' ? value.toLocaleString() : value;
    };

    return (
      <div className="rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">
              {formatValue()}
            </p>
            {trend && (
              <p className={`text-xs mt-1 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
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
          <h1 className="text-3xl font-bold text-white">Financial <span className="text-yellow-400">Command Center</span></h1>
          <p className="text-gray-300 mt-1">Master Wayne's financial overview for {currentMonth.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          {hasCompletedOnboarding && (
            <button
              onClick={() => setShowOnboarding(true)}
              className="flex items-center space-x-2 px-3 py-2 text-blue-400 hover:bg-black rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Take Tour</span>
            </button>
          )}
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{currentMonth.name}</span>
          </div>
        </div>
      </div>

      {/* Welcome Message for New Users */}
      {!hasData && hasCompletedOnboarding && (
        <div className="rounded-xl p-6 border" style={{ background: 'linear-gradient(to right, #1a1a1a, #2a2a2a)', borderColor: '#fbbf24' }}>
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-lg border" style={{ backgroundColor: '#1a1a1a', borderColor: '#fbbf24' }}>
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                <span className="text-yellow-400">Pennyworth</span> at your service! 🦇
              </h3>
              <p className="text-gray-300 mb-4">
                Allow me to assist you in managing your finances with the utmost care and precision, just as I've done for the Wayne family.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all hover:bg-yellow-400 hover:text-black text-sm" style={{ backgroundColor: '#1a1a1a', color: '#f3f4f6', borderColor: '#333333' }}>
                  <span>Record First Expense</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all hover:bg-yellow-400 hover:text-black text-sm" style={{ backgroundColor: '#1a1a1a', color: '#f3f4f6', borderColor: '#333333' }}>
                  <span>Record Income</span>
                </button>
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-yellow-400 border border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition-all text-sm"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Butler's Tutorial</span>
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
          showCurrency={false}
        />
      </div>

      {/* Budget vs Actual */}
      <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
        <h2 className="text-xl font-semibold text-white mb-6">Budget vs Actual</h2>
        <BudgetProgress
          categories={allCategories}
          expensesByCategory={expensesByCategory}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
          <h2 className="text-xl font-semibold text-white mb-6">Spending by Category</h2>
          <ExpenseChart
            data={expensesByCategory}
            categories={allCategories}
          />
        </div>

        <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
          <h2 className="text-xl font-semibold text-white mb-6">Financial Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-900 rounded-lg">
              <span className="font-medium text-green-200">Total Budget</span>
              <span className="font-bold text-green-200">${monthlyStats.totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-900 rounded-lg">
              <span className="font-medium text-blue-200">Actual Expenses</span>
              <span className="font-bold text-blue-200">${monthlyStats.totalExpenses.toLocaleString()}</span>
            </div>
            <div className={`flex justify-between items-center p-4 rounded-lg ${monthlyStats.totalExpenses <= monthlyStats.totalBudget ? 'bg-green-900' : 'bg-red-900'
              }`}>
              <span className={`font-medium ${monthlyStats.totalExpenses <= monthlyStats.totalBudget ? 'text-green-200' : 'text-red-200'
                }`}>
                Budget Remaining
              </span>
              <span className={`font-bold ${monthlyStats.totalExpenses <= monthlyStats.totalBudget ? 'text-green-200' : 'text-red-200'
                }`}>
                ${(monthlyStats.totalBudget - monthlyStats.totalExpenses).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alfred's Dashboard Wisdom */}
      <div className="rounded-xl shadow-lg border p-6 text-center" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
        <div className="mb-3">
          <div className="w-12 h-12 bg-yellow-400 rounded-full mx-auto flex items-center justify-center">
            <span className="text-xl">🦇</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          <span className="text-yellow-400">Alfred's</span> Daily Wisdom
        </h3>
        <p className="text-gray-300 italic max-w-xl mx-auto">
          "Master Wayne, a well-organized financial overview is like a well-maintained manor -
          every detail in its proper place, every expense accounted for, every goal clearly visible."
        </p>
        <p className="text-yellow-400 text-sm mt-2">- Alfred Pennyworth</p>
      </div>

      {/* Onboarding */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="p-6 border-b" style={{ borderColor: '#333333' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Quick Tour</h2>
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="p-2 hover:opacity-70 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                Need a refresher? You can always retake the onboarding tour from the help menu or by clicking the "Take Tour" button.
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem('onboarding-completed');
                  window.location.reload();
                }}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors"
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