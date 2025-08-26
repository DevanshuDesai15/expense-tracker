import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Download,
  DollarSign,
  TrendingUp,
  Calendar,
  Repeat,
  X
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { INCOME_SOURCES } from '../data/defaultCategories';

const IncomeList = ({ incomeEntries, onEdit, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [dateRange, setDateRange] = useState('current-month');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedIncomes, setSelectedIncomes] = useState(new Set());

  const currentMonth = useMemo(() => {
    const now = new Date();
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
      name: format(now, 'MMMM yyyy')
    };
  }, []);

  const filteredAndSortedIncomes = useMemo(() => {
    let filtered = incomeEntries.filter(income => {
      // Search filter
      const matchesSearch = !searchTerm || 
        getSourceName(income.source)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Source filter
      const matchesSource = !selectedSource || income.source === selectedSource;

      // Date filter
      const incomeDate = parseISO(income.date);
      let matchesDate = true;
      
      switch (dateRange) {
        case 'current-month':
          matchesDate = incomeDate >= currentMonth.start && incomeDate <= currentMonth.end;
          break;
        case 'last-30-days':
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          matchesDate = incomeDate >= thirtyDaysAgo;
          break;
        case 'last-90-days':
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          matchesDate = incomeDate >= ninetyDaysAgo;
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesSource && matchesDate;
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
        case 'source-asc':
          return getSourceName(a.source).localeCompare(getSourceName(b.source));
        default:
          return 0;
      }
    });

    return filtered;
  }, [incomeEntries, searchTerm, selectedSource, dateRange, sortBy, currentMonth]);

  const totalAmount = filteredAndSortedIncomes.reduce((sum, income) => sum + income.amount, 0);
  const averageAmount = filteredAndSortedIncomes.length ? totalAmount / filteredAndSortedIncomes.length : 0;
  const recurringCount = filteredAndSortedIncomes.filter(income => income.recurring).length;

  const getSourceName = (sourceId) => {
    const source = INCOME_SOURCES.find(src => src.id === sourceId);
    return source ? source.name : sourceId || 'Unknown Source';
  };

  const handleSelectIncome = (incomeId) => {
    const newSelected = new Set(selectedIncomes);
    if (newSelected.has(incomeId)) {
      newSelected.delete(incomeId);
    } else {
      newSelected.add(incomeId);
    }
    setSelectedIncomes(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIncomes.size === filteredAndSortedIncomes.length) {
      setSelectedIncomes(new Set());
    } else {
      setSelectedIncomes(new Set(filteredAndSortedIncomes.map(i => i.id)));
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Source', 'Amount', 'Recurring', 'Frequency', 'Description'],
      ...filteredAndSortedIncomes.map(income => [
        income.date,
        getSourceName(income.source),
        income.amount,
        income.recurring ? 'Yes' : 'No',
        income.frequency || '',
        income.description || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `income-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const IncomeCard = ({ income }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <input
              type="checkbox"
              checked={selectedIncomes.has(income.id)}
              onChange={() => handleSelectIncome(income.id)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{getSourceName(income.source)}</h3>
              {income.recurring && (
                <div className="flex items-center space-x-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <Repeat className="w-3 h-3" />
                  <span>{income.frequency}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Amount</span>
              <p className="font-semibold text-green-600">${income.amount.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-500">Date</span>
              <p className="font-medium">{format(parseISO(income.date), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <span className="text-gray-500">Type</span>
              <p className="font-medium">{income.recurring ? 'Recurring' : 'One-time'}</p>
            </div>
          </div>
          
          {income.description && (
            <p className="text-sm text-gray-600 mt-2">{income.description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(income)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(income.id)}
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
          <h1 className="text-3xl font-bold text-gray-900">Income</h1>
          <p className="text-gray-600 mt-1">Track and manage your income sources</p>
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
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-green-600">${totalAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{filteredAndSortedIncomes.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average Amount</p>
              <p className="text-2xl font-bold text-gray-900">${averageAmount.toFixed(0)}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Recurring Sources</p>
              <p className="text-2xl font-bold text-purple-600">{recurringCount}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Repeat className="w-6 h-6 text-purple-600" />
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
              placeholder="Search sources or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Sources</option>
            {INCOME_SOURCES.map(source => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
          
          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="source-asc">Source A-Z</option>
          </select>
        </div>
        
        {/* Clear Filters */}
        {(searchTerm || selectedSource || dateRange !== 'current-month' || sortBy !== 'date-desc') && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              Showing {filteredAndSortedIncomes.length} of {incomeEntries.length} income entries
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSource('');
                setDateRange('current-month');
                setSortBy('date-desc');
              }}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedIncomes.size > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-green-800 font-medium">
            {selectedIncomes.size} income entr{selectedIncomes.size !== 1 ? 'ies' : 'y'} selected
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                const selectedData = filteredAndSortedIncomes.filter(i => selectedIncomes.has(i.id));
                const csvContent = [
                  ['Date', 'Source', 'Amount', 'Recurring', 'Frequency', 'Description'],
                  ...selectedData.map(income => [
                    income.date,
                    getSourceName(income.source),
                    income.amount,
                    income.recurring ? 'Yes' : 'No',
                    income.frequency || '',
                    income.description || ''
                  ])
                ].map(row => row.join(',')).join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `selected-income-${format(new Date(), 'yyyy-MM-dd')}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              Export Selected
            </button>
            <button
              onClick={() => setSelectedIncomes(new Set())}
              className="text-gray-600 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Income List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Income List ({filteredAndSortedIncomes.length})
            </h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedIncomes.size === filteredAndSortedIncomes.length && filteredAndSortedIncomes.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span>Select All</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredAndSortedIncomes.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No income entries found</h3>
              <p className="text-gray-600 mb-6">
                {incomeEntries.length === 0 
                  ? "Start by adding your first income entry to track your earnings."
                  : "Try adjusting your filters to see more results."
                }
              </p>
              <button
                onClick={onAdd}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Income</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedIncomes.map((income) => (
                <IncomeCard key={income.id} income={income} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeList;