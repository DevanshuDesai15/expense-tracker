import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Receipt, 
  DollarSign, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import IncomeForm from './components/IncomeForm';
import IncomeList from './components/IncomeList';
import Onboarding from './components/Onboarding';
import { useExpenses } from './hooks/useExpenses';
import { useIncome } from './hooks/useIncome';

type ActiveView = 'dashboard' | 'expenses' | 'income' | 'analytics';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const { 
    expenses, 
    loading: expensesLoading, 
    error: expensesError, 
    addExpense, 
    updateExpense, 
    deleteExpense 
  } = useExpenses();

  const { 
    incomeEntries, 
    loading: incomeLoading, 
    error: incomeError, 
    addIncome, 
    updateIncome, 
    deleteIncome 
  } = useIncome();

  // Check if user has completed onboarding
  useEffect(() => {
    const completed = localStorage.getItem('onboarding-completed');
    const hasData = expenses.length > 0 || incomeEntries.length > 0;
    
    if (!completed && !hasData && !expensesLoading && !incomeLoading) {
      setShowOnboarding(true);
    }
    
    setHasCompletedOnboarding(!!completed);
  }, [expenses.length, incomeEntries.length, expensesLoading, incomeLoading]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setHasCompletedOnboarding(true);
  };

  const handleAddExpense = async (expenseData: any) => {
    try {
      await addExpense(expenseData);
      setShowExpenseForm(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleUpdateExpense = async (expenseData: any) => {
    if (editingExpense) {
      try {
        await updateExpense(editingExpense.id, expenseData);
        setEditingExpense(null);
        setShowExpenseForm(false);
      } catch (error) {
        console.error('Error updating expense:', error);
      }
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleAddIncome = async (incomeData: any) => {
    try {
      await addIncome(incomeData);
      setShowIncomeForm(false);
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const handleEditIncome = (income: any) => {
    setEditingIncome(income);
    setShowIncomeForm(true);
  };

  const handleUpdateIncome = async (incomeData: any) => {
    if (editingIncome) {
      try {
        await updateIncome(editingIncome.id, incomeData);
        setEditingIncome(null);
        setShowIncomeForm(false);
      } catch (error) {
        console.error('Error updating income:', error);
      }
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await deleteIncome(id);
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'income', label: 'Income', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard expenses={expenses} incomeEntries={incomeEntries} />;
      case 'expenses':
        return (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            onAdd={() => setShowExpenseForm(true)}
          />
        );
      case 'income':
        return (
          <IncomeList
            incomeEntries={incomeEntries}
            onEdit={handleEditIncome}
            onDelete={handleDeleteIncome}
            onAdd={() => setShowIncomeForm(true)}
          />
        );
      case 'analytics':
        return <Dashboard expenses={expenses} incomeEntries={incomeEntries} />;
      default:
        return <Dashboard expenses={expenses} incomeEntries={incomeEntries} />;
    }
  };

  if (expensesLoading || incomeLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  if (expensesError || incomeError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 mb-2">Error loading data</p>
          <p className="text-gray-600 text-sm">{expensesError || incomeError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">FinanceTracker</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as ActiveView);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeView === item.id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <button
              onClick={() => setShowExpenseForm(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Expense</span>
            </button>
            <button
              onClick={() => setShowIncomeForm(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Income</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                {activeView}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => setShowExpenseForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline">Expense</span>
                </button>
                <button
                  onClick={() => setShowIncomeForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline">Income</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Forms */}
      <ExpenseForm
        isOpen={showExpenseForm}
        onClose={() => {
          setShowExpenseForm(false);
          setEditingExpense(null);
        }}
        onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
        expense={editingExpense}
      />

      <IncomeForm
        isOpen={showIncomeForm}
        onClose={() => {
          setShowIncomeForm(false);
          setEditingIncome(null);
        }}
        onSubmit={editingIncome ? handleUpdateIncome : handleAddIncome}
        income={editingIncome}
      />

      {/* Onboarding */}
      <Onboarding
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
}

export default App;