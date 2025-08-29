import React, { useMemo } from 'react';
import { Scale, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { useSavingsAllocations } from '../hooks/useSavingsAllocations';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const BalanceValidation = ({ monthlyStats }) => {
    const { allocations, loading } = useSavingsAllocations();

    const currentMonth = useMemo(() => {
        const now = new Date();
        return {
            start: startOfMonth(now),
            end: endOfMonth(now),
            name: format(now, 'MMMM yyyy')
        };
    }, []);

    const monthlyAllocations = useMemo(() => {
        if (!allocations || loading) return [];
        return allocations.filter(allocation => {
            const allocationDate = new Date(allocation.date);
            return allocationDate >= currentMonth.start && allocationDate <= currentMonth.end;
        });
    }, [allocations, currentMonth, loading]);

    const totalAllocated = monthlyAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);

    // Balance Calculation: Income - Expenses - Allocations = Unaccounted
    const unaccountedFunds = monthlyStats.totalIncome - monthlyStats.totalExpenses - totalAllocated;
    const isBalanced = Math.abs(unaccountedFunds) < 0.01; // Account for floating point precision
    const isOverAllocated = unaccountedFunds < -0.01;
    const hasUnallocatedFunds = unaccountedFunds > 0.01;

    if (loading) {
        return (
            <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                <h2 className="text-xl font-semibold text-white mb-6">Financial <span className="text-yellow-400">Balance</span></h2>
                <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                </div>
            </div>
        );
    }

    const getStatusColor = () => {
        if (isBalanced) return 'green';
        if (isOverAllocated) return 'red';
        return 'yellow';
    };

    const getStatusIcon = () => {
        if (isBalanced) return CheckCircle;
        return AlertTriangle;
    };

    const getStatusMessage = () => {
        if (isBalanced) return 'All funds accounted for';
        if (isOverAllocated) return 'Over-allocated funds detected';
        return 'Unallocated funds available';
    };

    const getStatusDescription = () => {
        if (isBalanced) return 'Your financial balance is perfect! Every dollar has been accounted for.';
        if (isOverAllocated) return `You've allocated $${Math.abs(unaccountedFunds).toFixed(2)} more than your available surplus.`;
        return `You have $${unaccountedFunds.toFixed(2)} in unallocated funds. Consider adding them to your savings goals.`;
    };

    const StatusIcon = getStatusIcon();
    const statusColor = getStatusColor();
    const statusColors = {
        green: {
            bg: '#065f46',
            border: '#10b981',
            text: '#d1fae5',
            icon: '#10b981'
        },
        yellow: {
            bg: '#92400e',
            border: '#f59e0b',
            text: '#fef3c7',
            icon: '#f59e0b'
        },
        red: {
            bg: '#7f1d1d',
            border: '#ef4444',
            text: '#fecaca',
            icon: '#ef4444'
        }
    };

    return (
        <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Financial <span className="text-yellow-400">Balance</span></h2>
                <Scale className="w-6 h-6 text-yellow-400" />
            </div>

            {/* Balance Status Banner */}
            <div
                className="p-4 rounded-lg mb-6 border"
                style={{
                    backgroundColor: statusColors[statusColor].bg,
                    borderColor: statusColors[statusColor].border
                }}
            >
                <div className="flex items-center space-x-3">
                    <StatusIcon
                        className="w-6 h-6 flex-shrink-0"
                        style={{ color: statusColors[statusColor].icon }}
                    />
                    <div className="flex-1">
                        <p
                            className="font-semibold text-lg"
                            style={{ color: statusColors[statusColor].text }}
                        >
                            {getStatusMessage()}
                        </p>
                        <p
                            className="text-sm mt-1"
                            style={{ color: statusColors[statusColor].text }}
                        >
                            {getStatusDescription()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p
                            className="text-2xl font-bold"
                            style={{ color: statusColors[statusColor].icon }}
                        >
                            {isBalanced ? '$0.00' : `$${Math.abs(unaccountedFunds).toFixed(2)}`}
                        </p>
                        <p
                            className="text-xs"
                            style={{ color: statusColors[statusColor].text }}
                        >
                            {isBalanced ? 'Perfect!' : isOverAllocated ? 'Over-allocated' : 'Unallocated'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Balance Breakdown */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-3">
                    Balance Equation:
                    <span className="text-yellow-400 ml-2">Income - Expenses - Allocations = Balance</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Income */}
                    <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                        <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Income</p>
                        <p className="text-lg font-bold text-green-400">
                            +${monthlyStats.totalIncome.toLocaleString()}
                        </p>
                    </div>

                    {/* Expenses */}
                    <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                        <div className="w-5 h-5 text-red-400 mx-auto mb-2 flex items-center justify-center">-</div>
                        <p className="text-sm text-gray-400">Expenses</p>
                        <p className="text-lg font-bold text-red-400">
                            -${monthlyStats.totalExpenses.toLocaleString()}
                        </p>
                    </div>

                    {/* Allocations */}
                    <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                        <div className="w-5 h-5 text-blue-400 mx-auto mb-2 flex items-center justify-center">-</div>
                        <p className="text-sm text-gray-400">Allocations</p>
                        <p className="text-lg font-bold text-blue-400">
                            -${totalAllocated.toLocaleString()}
                        </p>
                    </div>

                    {/* Balance Result */}
                    <div className="p-4 rounded-lg border text-center" style={{
                        backgroundColor: '#0a0a0a',
                        borderColor: statusColors[statusColor].border
                    }}>
                        <div className="w-5 h-5 mx-auto mb-2 flex items-center justify-center text-lg font-bold">=</div>
                        <p className="text-sm text-gray-400">Balance</p>
                        <p className={`text-lg font-bold`} style={{ color: statusColors[statusColor].icon }}>
                            {isBalanced ? '$0.00' :
                                isOverAllocated ? `-$${Math.abs(unaccountedFunds).toFixed(2)}` :
                                    `+$${unaccountedFunds.toFixed(2)}`
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Items */}
            {!isBalanced && (
                <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                    <h4 className="text-md font-semibold text-white mb-2">Recommended Actions</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                        {hasUnallocatedFunds && (
                            <>
                                <li>• Allocate remaining ${unaccountedFunds.toFixed(2)} to savings goals</li>
                                <li>• Consider increasing your emergency fund</li>
                                <li>• Review investment opportunities</li>
                            </>
                        )}
                        {isOverAllocated && (
                            <>
                                <li>• Review and reduce savings allocations by ${Math.abs(unaccountedFunds).toFixed(2)}</li>
                                <li>• Check for duplicate or incorrect entries</li>
                                <li>• Ensure all income and expenses are recorded accurately</li>
                            </>
                        )}
                    </ul>
                </div>
            )}

            {/* Wayne Manor Quote */}
            {isBalanced && (
                <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
                    <p className="text-sm text-gray-300 italic text-center">
                        "A penny saved is a penny earned, Master Wayne. Your financial discipline would make even the Wayne family legacy proud."
                        <span className="text-yellow-400 block mt-1">- Alfred Pennyworth</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default BalanceValidation;
