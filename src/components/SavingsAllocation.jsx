import React, { useState, useMemo, useEffect } from 'react';
import { PiggyBank, Plus, X, Edit, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { SAVINGS_DESTINATIONS } from '../data/defaultCategories';
import { useSavingsAllocations } from '../hooks/useSavingsAllocations';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const SavingsAllocation = ({ monthlyProfit, monthlyStats }) => {
    const { allocations, addAllocation, updateAllocation, deleteAllocation, loading } = useSavingsAllocations();
    const [showAllocationModal, setShowAllocationModal] = useState(false);
    const [editingAllocation, setEditingAllocation] = useState(null);
    const [formData, setFormData] = useState({
        destination: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: ''
    });

    const currentMonth = useMemo(() => {
        const now = new Date();
        return {
            start: startOfMonth(now),
            end: endOfMonth(now),
            name: format(now, 'MMMM yyyy')
        };
    }, []);

    // Get current month allocations
    const monthlyAllocations = useMemo(() => {
        return allocations.filter(allocation => {
            const allocationDate = new Date(allocation.date);
            return allocationDate >= currentMonth.start && allocationDate <= currentMonth.end;
        });
    }, [allocations, currentMonth]);

    const totalAllocated = monthlyAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
    const unallocatedFunds = monthlyProfit - totalAllocated;
    const isBalanced = Math.abs(unallocatedFunds) < 0.01; // Account for floating point precision

    useEffect(() => {
        if (editingAllocation) {
            setFormData({
                destination: editingAllocation.destination,
                amount: editingAllocation.amount.toString(),
                date: format(new Date(editingAllocation.date), 'yyyy-MM-dd'),
                description: editingAllocation.description || ''
            });
        } else {
            setFormData({
                destination: '',
                amount: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                description: ''
            });
        }
    }, [editingAllocation]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allocationData = {
            destination: formData.destination,
            amount: parseFloat(formData.amount),
            date: formData.date,
            description: formData.description
        };

        try {
            if (editingAllocation) {
                await updateAllocation(editingAllocation.id, allocationData);
            } else {
                await addAllocation(allocationData);
            }
            setShowAllocationModal(false);
            setEditingAllocation(null);
            setFormData({
                destination: '',
                amount: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                description: ''
            });
        } catch (error) {
            console.error('Error saving allocation:', error);
        }
    };

    const handleEdit = (allocation) => {
        setEditingAllocation(allocation);
        setShowAllocationModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteAllocation(id);
        } catch (error) {
            console.error('Error deleting allocation:', error);
        }
    };

    const getDestinationInfo = (destinationId) => {
        return SAVINGS_DESTINATIONS.find(dest => dest.id === destinationId) ||
            { name: destinationId, description: 'Custom destination', icon: '💰' };
    };

    const AllocationModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="rounded-lg max-w-md w-full p-6 border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
                            <PiggyBank className="w-5 h-5 text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            {editingAllocation ? 'Edit' : 'Allocate'} <span className="text-yellow-400">Surplus</span>
                        </h3>
                    </div>
                    <button
                        onClick={() => {
                            setShowAllocationModal(false);
                            setEditingAllocation(null);
                        }}
                        className="text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Destination *
                        </label>
                        <select
                            name="destination"
                            value={formData.destination}
                            onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                            required
                            className="w-full px-3 py-2 border rounded-lg text-white placeholder-gray-400"
                            style={{
                                backgroundColor: '#0a0a0a',
                                borderColor: '#555555'
                            }}
                        >
                            <option value="">Select savings destination</option>
                            {SAVINGS_DESTINATIONS.map(dest => (
                                <option key={dest.id} value={dest.id}>
                                    {dest.icon} {dest.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Amount *
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 font-medium">$</span>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                required
                                min="0"
                                step="0.01"
                                className="w-full pl-8 pr-3 py-2 border rounded-lg text-white placeholder-gray-400"
                                style={{
                                    backgroundColor: '#0a0a0a',
                                    borderColor: '#555555'
                                }}
                                placeholder="0.00"
                            />
                        </div>
                        {unallocatedFunds > 0 && (
                            <p className="text-xs text-yellow-400 mt-1">
                                Available: ${unallocatedFunds.toFixed(2)}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-lg text-white"
                            style={{
                                backgroundColor: '#0a0a0a',
                                borderColor: '#555555'
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-lg text-white placeholder-gray-400"
                            style={{
                                backgroundColor: '#0a0a0a',
                                borderColor: '#555555'
                            }}
                            placeholder="Optional note about this allocation"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowAllocationModal(false);
                                setEditingAllocation(null);
                            }}
                            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
                            style={{ backgroundColor: '#0a0a0a' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors"
                            style={{ backgroundColor: '#1a1a1a' }}
                        >
                            {editingAllocation ? 'Update' : 'Allocate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                <h2 className="text-xl font-semibold text-white mb-6">Surplus <span className="text-yellow-400">Allocation</span></h2>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Surplus <span className="text-yellow-400">Allocation</span></h2>
                    <button
                        onClick={() => setShowAllocationModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors"
                        style={{ backgroundColor: '#1a1a1a' }}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Allocate Funds</span>
                    </button>
                </div>

                {/* Balance Status */}
                <div className={`p-4 rounded-lg mb-6 ${isBalanced ? 'border-green-600' : unallocatedFunds > 0 ? 'border-yellow-600' : 'border-red-600'}`}
                    style={{ backgroundColor: isBalanced ? '#065f46' : unallocatedFunds > 0 ? '#92400e' : '#7f1d1d' }}>
                    <div className="flex items-center space-x-2">
                        {isBalanced ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        )}
                        <div>
                            <p className={`font-semibold ${isBalanced ? 'text-green-200' : 'text-yellow-200'}`}>
                                {isBalanced ? 'Perfectly Balanced!' : 'Unallocated Funds'}
                            </p>
                            <p className={`text-sm ${isBalanced ? 'text-green-300' : 'text-yellow-300'}`}>
                                {isBalanced
                                    ? 'All surplus funds have been allocated to savings goals.'
                                    : `$${Math.abs(unallocatedFunds).toFixed(2)} ${unallocatedFunds > 0 ? 'remaining to allocate' : 'over-allocated'}`
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                        <p className="text-sm text-gray-400">Monthly Profit</p>
                        <p className="text-xl font-bold text-green-400">${monthlyProfit.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                        <p className="text-sm text-gray-400">Total Allocated</p>
                        <p className="text-xl font-bold text-blue-400">${totalAllocated.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                        <p className="text-sm text-gray-400">Unallocated</p>
                        <p className={`text-xl font-bold ${unallocatedFunds === 0 ? 'text-green-400' : unallocatedFunds > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                            ${Math.abs(unallocatedFunds).toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Allocations List */}
                <div className="space-y-3">
                    {monthlyAllocations.length > 0 ? (
                        monthlyAllocations.map(allocation => {
                            const destInfo = getDestinationInfo(allocation.destination);
                            return (
                                <div key={allocation.id} className="flex items-center justify-between p-4 rounded-lg border hover:opacity-80 transition-opacity"
                                    style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{destInfo.icon}</span>
                                        <div>
                                            <p className="font-medium text-white">{destInfo.name}</p>
                                            <p className="text-sm text-gray-400">
                                                {allocation.description || destInfo.description}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {format(new Date(allocation.date), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <p className="text-lg font-semibold text-green-400">
                                            ${allocation.amount.toFixed(2)}
                                        </p>
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleEdit(allocation)}
                                                className="p-2 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(allocation.id)}
                                                className="p-2 text-red-400 hover:bg-red-400 hover:text-black rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8">
                            <PiggyBank className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400">No allocations for {currentMonth.name}</p>
                            <p className="text-sm text-gray-500 mt-1">Start allocating your surplus to reach your financial goals!</p>
                        </div>
                    )}
                </div>
            </div>

            {showAllocationModal && <AllocationModal />}
        </>
    );
};

export default SavingsAllocation;
