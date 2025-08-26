import React, { useState, useEffect } from 'react';
import { X, Plus, DollarSign } from 'lucide-react';
import { INCOME_SOURCES } from '../data/defaultCategories';
import { format } from 'date-fns';

const IncomeForm = ({ isOpen, onClose, onSubmit, income = null }) => {
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    recurring: false,
    frequency: 'monthly'
  });

  useEffect(() => {
    if (income) {
      setFormData({
        source: income.source || '',
        amount: income.amount?.toString() || '',
        date: income.date ? format(new Date(income.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        description: income.description || '',
        recurring: income.recurring || false,
        frequency: income.frequency || 'monthly'
      });
    } else {
      setFormData({
        source: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        recurring: false,
        frequency: 'monthly'
      });
    }
  }, [income]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const incomeData = {
      source: formData.source,
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description,
      recurring: formData.recurring,
      frequency: formData.frequency
    };

    onSubmit(incomeData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {income ? 'Edit Income' : 'Add New Income'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Income Source *
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="">Select income source</option>
                {INCOME_SOURCES.map(source => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            {/* Frequency (if recurring) */}
            {formData.recurring && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
          </div>

          {/* Recurring checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="recurring"
              id="recurring"
              checked={formData.recurring}
              onChange={handleChange}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
              This is a recurring income
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Expected Amount Display */}
          {formData.source && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-900 flex items-center mb-2">
                <DollarSign className="w-4 h-4 mr-2" />
                Expected Amount Information
              </h3>
              {INCOME_SOURCES.find(s => s.id === formData.source) && (
                <p className="text-green-700 text-sm">
                  Expected amount for {INCOME_SOURCES.find(s => s.id === formData.source).name}: 
                  <span className="font-semibold ml-1">
                    ${INCOME_SOURCES.find(s => s.id === formData.source).expectedAmount.toLocaleString()}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              {income ? 'Update Income' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeForm;