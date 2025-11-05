import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Plus,
  Receipt,
  DollarSign,
  BarChart3,
  TrendingUp,
  Home,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  ChevronRight,
  Wallet
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import FinancialOverview from './components/FinancialOverview';
import Analytics from './components/Analytics';
import FinancialPlanning from './components/FinancialPlanning';
import Profile from './components/Profile';
import SmartHomeDashboard from './components/SmartHomeDashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import IncomeForm from './components/IncomeForm';
import IncomeList from './components/IncomeList';
// import Onboarding from './components/Onboarding';
import AuthModal from './components/AuthModal';
import LoanForm from './components/LoanForm';
import CreditCardForm from './components/CreditCardForm';
import SavingsForm from './components/SavingsForm';
import SquareBack from './components/SquareBack';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { useExpenses } from './hooks/useExpenses';
import { useIncome } from './hooks/useIncome';
import { useCategories } from './hooks/useCategories';
import { useCreditCards } from './hooks/useCreditCards';
import { useLoans } from './hooks/useLoans';
import { useSavingsAccounts } from './hooks/useSavingsAccounts';
import { format, startOfMonth, endOfMonth } from 'date-fns';

type ActiveView = 'dashboard' | 'financial-overview' | 'expenses' | 'income' | 'analytics' | 'financial-planning' | 'smart-home' | 'financial-settings';

const AppContent = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showCreditCardForm, setShowCreditCardForm] = useState(false);
  const [showSavingsForm, setShowSavingsForm] = useState(false);
  // const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [expenseMenuExpanded, setExpenseMenuExpanded] = useState(true);

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
      // const completed = localStorage.getItem(`onboarding-completed-${user.uid}`);
      // const hasData = expenses.length > 0 || incomeEntries.length > 0;
      
      // if (!completed && !hasData && !expensesLoading && !incomeLoading) {
      //   setShowOnboarding(true);
      // }
      
      // setHasCompletedOnboarding(!!completed);
    }
  }, [user, authLoading]);

  // const handleOnboardingComplete = () => {
  //   if (user) {
  //     localStorage.setItem(`onboarding-completed-${user.uid}`, 'true');
  //     setHasCompletedOnboarding(true);
  //     setShowOnboarding(false);
  //   }
  // };

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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, type: 'main' },
    { id: 'smart-home', label: 'Smart Home', icon: Home, type: 'main' },
  ];

  const expenseSubItems = [
    { id: 'financial-overview', label: 'Overview', icon: BarChart3 },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'income', label: 'Income', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'financial-planning', label: 'Planning', icon: TrendingUp },
    { id: 'financial-settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'financial-overview':
        return <FinancialOverview expenses={expenses} incomeEntries={incomeEntries} monthlyStats={monthlyStats} />;
      case 'smart-home':
        return <SmartHomeDashboard />;
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
      case 'financial-settings':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  if (authLoading || expensesLoading || incomeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-100">
            {authLoading ? 'Authenticating...' : 'Loading your data...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="text-center">
            <div className="p-8 rounded-2xl shadow-2xl max-w-md border border-cyan-500/30 backdrop-blur-sm bg-slate-900/50">
              <div className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">ALFRED</span></h1>
              <p className="text-slate-300 mb-6">Automated Lifestyle & Financial Resource Executive Director</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-3 px-4 rounded-lg transition-all font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg hover:shadow-cyan-500/50"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-400 mb-2">Error loading data</p>
          <p className="text-slate-300 text-sm">{expensesError || incomeError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <SquareBack
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#0ff"
          hoverFillColor="#222"
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 shadow-2xl transform transition-transform duration-300 ease-in-out border-r border-cyan-500/20 backdrop-blur-xl relative
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{backgroundColor: 'rgba(15, 23, 42, 0.8)'}}>
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">ALFRED</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded transition-colors hover:text-cyan-400"
          >
            <X className="w-5 h-5 text-slate-400" />
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeView === item.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 font-medium shadow-lg shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
          
          {/* Expense Management Expandable Section */}
          <div className="space-y-1">
            <button
              onClick={() => setExpenseMenuExpanded(!expenseMenuExpanded)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all ${
                ['expenses', 'income', 'analytics', 'financial-planning'].includes(activeView)
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 font-medium'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5" />
                <span>Expense Management</span>
              </div>
              {expenseMenuExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {expenseMenuExpanded && (
              <div className="ml-4 space-y-1 border-l-2 border-cyan-500/30 pl-4">
                {expenseSubItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => {
                      setActiveView(subItem.id as ActiveView);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all text-sm ${
                      activeView === subItem.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-cyan-400'
                    }`}
                  >
                    <subItem.icon className="w-4 h-4" />
                    <span>{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-cyan-500/20 mt-auto">
          
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <header className="shadow-lg border-b border-cyan-500/20 px-6 py-4 backdrop-blur-xl relative z-20" style={{backgroundColor: 'rgba(15, 23, 42, 0.8)'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-cyan-500/20 transition-colors"
              >
                <Menu className="w-5 h-5 text-cyan-300" />
              </button>
              <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 capitalize">
                {activeView === 'financial-planning' ? 'Planning' : activeView.replace('-', ' ')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div
                  className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-cyan-400 transition-colors"
                  onClick={() => setActiveView('financial-settings')}
                  title="Go to Profile"
                >
                  <div className="p-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:inline text-sm">
                    {user?.displayName || user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-400 rounded-lg transition-colors hover:text-red-400 hover:bg-red-500/10"
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
        <main className="flex-1 overflow-auto p-6 relative z-10" style={{backgroundColor: 'rgba(15, 23, 42, 0.3)'}}>
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
        onOpenSettings={() => setActiveView('financial-settings')}
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
      {/* <Onboarding
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      /> */}

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