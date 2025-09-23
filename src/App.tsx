import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Receipt, 
  DollarSign, 
  BarChart3, 
  TrendingUp,
  Settings,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import FinancialPlanning from './components/FinancialPlanning';
import Profile from './components/Profile';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import IncomeForm from './components/IncomeForm';
import IncomeList from './components/IncomeList';
import Onboarding from './components/Onboarding';
import AuthModal from './components/AuthModal';
import LoanForm from './components/LoanForm';
import CreditCardForm from './components/CreditCardForm';
import SavingsForm from './components/SavingsForm';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { useExpenses } from './hooks/useExpenses';
import { useIncome } from './hooks/useIncome';
import { useCategories } from './hooks/useCategories';
import { useCreditCards } from './hooks/useCreditCards';
import { useLoans } from './hooks/useLoans';
import { useSavingsAccounts } from './hooks/useSavingsAccounts';
import { format, startOfMonth, endOfMonth } from 'date-fns';

type ActiveView = 'dashboard' | 'expenses' | 'income' | 'analytics' | 'financial-planning' | 'profile';

const AppContent = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showCreditCardForm, setShowCreditCardForm] = useState(false);
  const [showSavingsForm, setShowSavingsForm] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const { user, loading: authLoading, logout } = useAuthContext();

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

  const { creditCards, addCreditCard } = useCreditCards();
  const { loans, addLoan } = useLoans();
  const { savingsAccounts, addSavingsAccount } = useSavingsAccounts();

  const { allCategories } = useCategories();

  // Calculate monthly stats
  const monthlyStats = React.useMemo(() => {
    const now = new Date();
    const currentMonth = {
      start: startOfMonth(now),
      end: endOfMonth(now),
      name: format(now, 'MMMM yyyy')
    };

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
    const totalBudget = allCategories.reduce((sum, cat) => sum + cat.budgetAmount, 0);

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
  }, [expenses, incomeEntries, allCategories]);

  // Check authentication and onboarding status
  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
      return;
    }

    if (user) {
      setShowAuthModal(false);
      
      // Check onboarding for authenticated user
      const completed = localStorage.getItem(`onboarding-completed-${user.uid}`);
      const hasData = expenses.length > 0 || incomeEntries.length > 0;
      
      if (!completed && !hasData && !expensesLoading && !incomeLoading) {
        setShowOnboarding(true);
      }
      
      setHasCompletedOnboarding(!!completed);
    }
  }, [user, authLoading, expenses.length, incomeEntries.length, expensesLoading, incomeLoading]);

  const handleOnboardingComplete = () => {
    if (user) {
      localStorage.setItem(`onboarding-completed-${user.uid}`, 'true');
      setHasCompletedOnboarding(true);
      setShowOnboarding(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
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
    { id: 'financial-planning', label: 'Financial Planning', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard expenses={expenses} incomeEntries={incomeEntries} monthlyStats={monthlyStats} />;
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
        return <Analytics expenses={expenses} incomeEntries={incomeEntries} />;
      case 'financial-planning':
        return <FinancialPlanning 
          incomeEntries={incomeEntries}
          creditCards={creditCards}
          loans={loans}
          savingsAccounts={savingsAccounts}
          onAddIncome={() => setShowIncomeForm(true)}
          onAddLoan={() => setShowLoanForm(true)}
          onAddCreditCard={() => setShowCreditCardForm(true)}
          onAddSavingsAccount={() => setShowSavingsForm(true)}
        />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard expenses={expenses} incomeEntries={incomeEntries} monthlyStats={monthlyStats} />;
    }
  };

  if (authLoading || expensesLoading || incomeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#0a0a0a'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">
            {authLoading ? 'Authenticating...' : 'Loading your financial data...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#0a0a0a'}}>
          <div className="text-center">
            <div className="p-8 rounded-lg shadow-xl max-w-md border" style={{backgroundColor: '#1a1a1a', borderColor: '#333333'}}>
              <div className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border" style={{backgroundColor: '#1a1a1a', borderColor: '#fbbf24'}}>
                <BarChart3 className="w-8 h-8 text-yellow-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to <span className="text-yellow-400">Pennyworth</span></h1>
              <p className="text-gray-300 mb-6">Your personal financial butler, at your service.</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-3 px-4 rounded-lg transition-all font-medium border hover:bg-yellow-400 hover:text-black"
                style={{backgroundColor: '#1a1a1a', color: '#fbbf24', borderColor: '#fbbf24'}}
              >
                Begin Service
              </button>
            </div>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  if (expensesError || incomeError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#0a0a0a'}}>
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-400 mb-2">Error loading data</p>
          <p className="text-gray-300 text-sm">{expensesError || incomeError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{backgroundColor: '#0a0a0a'}}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 shadow-xl transform transition-transform duration-300 ease-in-out border-r
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{backgroundColor: '#111111', borderColor: '#333333'}}>
        <div className="flex items-center justify-between p-6 border-b" style={{borderColor: '#333333'}}>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg" style={{backgroundColor: '#1a1a1a'}}>
              <BarChart3 className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xl font-bold text-yellow-400">Pennyworth</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded transition-colors hover:opacity-70"
          >
            <X className="w-5 h-5 text-gray-400" />
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
                  ? 'font-medium'
                  : 'text-gray-300 hover:opacity-70'
              }`}
              style={activeView === item.id ? {backgroundColor: '#1a1a1a', color: '#fbbf24', border: '1px solid #fbbf24'} : {}}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t" style={{borderColor: '#333333'}}>
          <div className="space-y-2">
            <button
              onClick={() => setShowExpenseForm(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:border-yellow-400 border border-transparent"
              style={{backgroundColor: '#1a1a1a', color: '#f3f4f6'}}
            >
              <Plus className="w-5 h-5" />
              <span>Record Expense</span>
            </button>
            <button
              onClick={() => setShowIncomeForm(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:border-yellow-400 border border-transparent"
              style={{backgroundColor: '#1a1a1a', color: '#f3f4f6'}}
            >
              <Plus className="w-5 h-5" />
              <span>Record Income</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="shadow-sm border-b px-6 py-4" style={{backgroundColor: '#111111', borderColor: '#333333'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:opacity-70 transition-opacity"
              >
                <Menu className="w-5 h-5 text-gray-300" />
              </button>
              <h1 className="text-2xl font-semibold text-white capitalize">
                {activeView}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => setShowExpenseForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all hover:bg-yellow-400 hover:text-black hover:border-yellow-400"
                  style={{backgroundColor: '#1a1a1a', color: '#f3f4f6', borderColor: '#333333'}}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline">Expense</span>
                </button>
                <button
                  onClick={() => setShowIncomeForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all hover:bg-yellow-400 hover:text-black hover:border-yellow-400"
                  style={{backgroundColor: '#1a1a1a', color: '#f3f4f6', borderColor: '#333333'}}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline">Income</span>
                </button>
              </div>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div
                  className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:opacity-80"
                  onClick={() => setActiveView('profile')}
                  title="Go to Profile"
                >
                  <div className="p-2 rounded-full" style={{backgroundColor: '#333333'}}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:inline text-sm">
                    {user?.displayName || user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-400 rounded-lg transition-colors hover:opacity-70"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6" style={{backgroundColor: '#0a0a0a'}}>
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
        onOpenSettings={() => setActiveView('profile')}
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

      <LoanForm
        isOpen={showLoanForm}
        onClose={() => setShowLoanForm(false)}
        onSubmit={addLoan}
      />

      <CreditCardForm
        isOpen={showCreditCardForm}
        onClose={() => setShowCreditCardForm(false)}
        onSubmit={addCreditCard}
      />

      <SavingsForm
        isOpen={showSavingsForm}
        onClose={() => setShowSavingsForm(false)}
        onSubmit={addSavingsAccount}
      />

      {/* Onboarding */}
      <Onboarding
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;