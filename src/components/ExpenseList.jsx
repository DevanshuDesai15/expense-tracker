import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Download,
  Calendar,
  DollarSign,
  Tag,
  Receipt,
  MoreVertical,
  X
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { DEFAULT_EXPENSE_CATEGORIES } from '../data/defaultCategories';

const ExpenseList = ({ expenses, onEdit, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState('current-month');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedExpenses, setSelectedExpenses] = useState(new Set());

  const currentMonth = useMemo(() => {
    const now = new Date();
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
      name: format(now, 'MMMM yyyy')
    };
  }, []);

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses.filter(expense => {
      // Search filter
      const matchesSearch = !searchTerm || 
        expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = !selectedCategory || expense.category === selectedCategory;

      // Date filter
      const expenseDate = parseISO(expense.date);
      let matchesDate = true;
      
      switch (dateRange) {
        case 'current-month':
          matchesDate = expenseDate >= currentMonth.start && expenseDate <= currentMonth.end;
          break;
        case 'last-30-days':
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          matchesDate = expenseDate >= thirtyDaysAgo;
          break;
        case 'last-90-days':
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          matchesDate = expenseDate >= ninetyDaysAgo;
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesCategory && matchesDate;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'vendor-asc':
          return (a.vendor || '').localeCompare(b.vendor || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [expenses, searchTerm, selectedCategory, dateRange, sortBy, currentMonth]);

  const totalAmount = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalCashBack = filteredAndSortedExpenses.reduce((sum, expense) => sum + (expense.cashBackEarned || 0), 0);

  const getCategoryName = (categoryId) => {
    const category = DEFAULT_EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const handleSelectExpense = (expenseId) => {
    const newSelected = new Set(selectedExpenses);
    if (newSelected.has(expenseId)) {
      newSelected.delete(expenseId);
    } else {
      newSelected.add(expenseId);
    }
    setSelectedExpenses(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedExpenses.size === filteredAndSortedExpenses.length) {
      setSelectedExpenses(new Set());
    } else {
      setSelectedExpenses(new Set(filteredAndSortedExpenses.map(e => e.id)));
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Vendor', 'Category', 'Amount', 'Payment Method', 'Card Used', 'Cash Back Rate', 'Cash Back Earned', 'Description'],
      ...filteredAndSortedExpenses.map(expense => [
        expense.date,
        expense.vendor,
        getCategoryName(expense.category),
        expense.amount,
        expense.paymentMethod,
        expense.cardUsed || '',
        `${(expense.cashBackRate * 100).toFixed(1)}%`,
        expense.cashBackEarned?.toFixed(2) || '0.00',
        expense.description || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ExpenseCard = ({ expense }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <input
              type="checkbox"
              checked={selectedExpenses.has(expense.id)}
              onChange={() => handleSelectExpense(expense.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{expense.vendor}</h3>
              <p className="text-sm text-gray-600">{getCategoryName(expense.category)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Amount</span>
              <p className="font-semibold text-gray-900">${expense.amount.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-500">Date</span>
              <p className="font-medium">{format(parseISO(expense.date), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <span className="text-gray-500">Payment</span>
              <p className="font-medium">{expense.paymentMethod}</p>
            </div>
            {expense.cashBackEarned > 0 && (
              <div>
                <span className="text-gray-500">Cash Back</span>
                <p className="font-medium text-green-600">${expense.cashBackEarned.toFixed(2)}</p>
              </div>
            )}
          </div>
          
          {expense.description && (
            <p className="text-sm text-gray-600 mt-2">{expense.description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track and manage your expenses</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={onAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Receipt className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{filteredAndSortedExpenses.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${filteredAndSortedExpenses.length ? (totalAmount / filteredAndSortedExpenses.length).toFixed(0) : '0'}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Cash Back Earned</p>
              <p className="text-2xl font-bold text-green-600">${totalCashBack.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Filter & Search</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center space-x-2 text-gray-600"
          >
            <Filter className="w-4 h-4" />
            <span>Toggle Filters</span>
          </button>
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden sm:grid'}`}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search vendors or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {DEFAULT_EXPENSE_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="current-month">Current Month</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
          </select>
          
          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="vendor-asc">Vendor A-Z</option>
          </select>
        </div>
        
        {/* Clear Filters */}
        {(searchTerm || selectedCategory || dateRange !== 'current-month' || sortBy !== 'date-desc') && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              Showing {filteredAndSortedExpenses.length} of {expenses.length} expenses
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setDateRange('current-month');
                setSortBy('date-desc');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedExpenses.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-blue-800 font-medium">
            {selectedExpenses.size} expense{selectedExpenses.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                const selectedData = filteredAndSortedExpenses.filter(e => selectedExpenses.has(e.id));
                const csvContent = [
                  ['Date', 'Vendor', 'Category', 'Amount', 'Payment Method', 'Description'],
                  ...selectedData.map(expense => [
                    expense.date,
                    expense.vendor,
                    getCategoryName(expense.category),
                    expense.amount,
                    expense.paymentMethod,
                    expense.description || ''
                  ])
                ].map(row => row.join(',')).join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `selected-expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Export Selected
            </button>
            <button
              onClick={() => setSelectedExpenses(new Set())}
              className="text-gray-600 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Expense List ({filteredAndSortedExpenses.length})
            </h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedExpenses.size === filteredAndSortedExpenses.length && filteredAndSortedExpenses.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Select All</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredAndSortedExpenses.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
              <p className="text-gray-600 mb-6">
                {expenses.length === 0 
                  ? "Start by adding your first expense to track your spending."
                  : "Try adjusting your filters to see more results."
                }
              </p>
              <button
                onClick={onAdd}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Expense</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedExpenses.map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;