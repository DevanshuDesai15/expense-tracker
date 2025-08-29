import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { INCOME_SOURCES } from '../data/defaultCategories';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const IncomeVariance = ({ incomeEntries }) => {
    const currentMonth = useMemo(() => {
        const now = new Date();
        return {
            start: startOfMonth(now),
            end: endOfMonth(now),
            name: format(now, 'MMMM yyyy')
        };
    }, []);

    const monthlyIncomeEntries = useMemo(() => {
        return incomeEntries.filter(income => {
            const incomeDate = new Date(income.date);
            return incomeDate >= currentMonth.start && incomeDate <= currentMonth.end;
        });
    }, [incomeEntries, currentMonth]);

    const incomeAnalysis = useMemo(() => {
        // Group actual income by source
        const actualIncomeBySource = {};
        monthlyIncomeEntries.forEach(income => {
            if (!actualIncomeBySource[income.source]) {
                actualIncomeBySource[income.source] = 0;
            }
            actualIncomeBySource[income.source] += income.amount;
        });

        // Compare with expected income
        const analysis = INCOME_SOURCES.map(source => {
            const actualAmount = actualIncomeBySource[source.id] || 0;
            const expectedAmount = source.expectedAmount;
            const variance = actualAmount - expectedAmount;
            const variancePercentage = expectedAmount > 0 ? (variance / expectedAmount) * 100 : 0;

            return {
                id: source.id,
                name: source.name,
                expected: expectedAmount,
                actual: actualAmount,
                variance,
                variancePercentage,
                status: variance >= 0 ? 'positive' : 'negative',
                isOnTarget: Math.abs(variancePercentage) <= 5, // Within 5% is considered "on target"
            };
        });

        const totalExpected = INCOME_SOURCES.reduce((sum, source) => sum + source.expectedAmount, 0);
        const totalActual = Object.values(actualIncomeBySource).reduce((sum, amount) => sum + amount, 0);
        const totalVariance = totalActual - totalExpected;
        const totalVariancePercentage = totalExpected > 0 ? (totalVariance / totalExpected) * 100 : 0;

        return {
            sources: analysis,
            totals: {
                expected: totalExpected,
                actual: totalActual,
                variance: totalVariance,
                variancePercentage: totalVariancePercentage,
                status: totalVariance >= 0 ? 'positive' : 'negative'
            }
        };
    }, [monthlyIncomeEntries]);

    const getVarianceColor = (status, isOnTarget) => {
        if (isOnTarget) return { text: 'text-green-400', bg: 'bg-green-900', border: 'border-green-600' };
        if (status === 'positive') return { text: 'text-blue-400', bg: 'bg-blue-900', border: 'border-blue-600' };
        return { text: 'text-red-400', bg: 'bg-red-900', border: 'border-red-600' };
    };

    const getVarianceIcon = (status, isOnTarget) => {
        if (isOnTarget) return CheckCircle;
        if (status === 'positive') return TrendingUp;
        return TrendingDown;
    };

    return (
        <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">Income <span className="text-yellow-400">Variance</span></h2>
                    <p className="text-gray-300 text-sm mt-1">Expected vs Actual for {currentMonth.name}</p>
                </div>
                <Target className="w-6 h-6 text-yellow-400" />
            </div>

            {/* Overall Summary */}
            <div className="mb-6 p-4 rounded-lg border" style={{
                backgroundColor: incomeAnalysis.totals.status === 'positive' ? '#1e3a8a' : '#7f1d1d',
                borderColor: incomeAnalysis.totals.status === 'positive' ? '#3b82f6' : '#ef4444'
            }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Total Income Performance</h3>
                        <p className={`text-sm ${incomeAnalysis.totals.status === 'positive' ? 'text-blue-200' : 'text-red-200'}`}>
                            {incomeAnalysis.totals.variance >= 0 ? 'Exceeding' : 'Below'} expectations by ${Math.abs(incomeAnalysis.totals.variancePercentage).toFixed(1)}%
                        </p>
                    </div>
                    <div className="text-right">
                        <p className={`text-2xl font-bold ${incomeAnalysis.totals.status === 'positive' ? 'text-blue-400' : 'text-red-400'}`}>
                            {incomeAnalysis.totals.variance >= 0 ? '+' : ''}${incomeAnalysis.totals.variance.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-300">
                            ${incomeAnalysis.totals.actual.toLocaleString()} / ${incomeAnalysis.totals.expected.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Income Sources Breakdown */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">Income Sources Breakdown</h3>

                {incomeAnalysis.sources.map(source => {
                    const colors = getVarianceColor(source.status, source.isOnTarget);
                    const VarianceIcon = getVarianceIcon(source.status, source.isOnTarget);

                    return (
                        <div key={source.id} className="p-4 rounded-lg border hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                                        <VarianceIcon className={`w-4 h-4 ${colors.text}`} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">{source.name}</h4>
                                        <p className="text-sm text-gray-400">
                                            {source.isOnTarget ? 'On Target' :
                                                source.status === 'positive' ? `+${source.variancePercentage.toFixed(1)}% above` :
                                                    `${Math.abs(source.variancePercentage).toFixed(1)}% below`} expected
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400">Actual</p>
                                            <p className="font-semibold text-white">${source.actual.toLocaleString()}</p>
                                        </div>
                                        <div className="text-gray-500">/</div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400">Expected</p>
                                            <p className="font-semibold text-gray-300">${source.expected.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {source.variance !== 0 && (
                                        <p className={`text-sm font-medium mt-1 ${colors.text}`}>
                                            {source.variance > 0 ? '+' : ''}${source.variance.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3">
                                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${source.isOnTarget ? 'bg-green-500' :
                                                source.status === 'positive' ? 'bg-blue-500' : 'bg-red-500'
                                            }`}
                                        style={{
                                            width: source.expected > 0
                                                ? `${Math.min((source.actual / source.expected) * 100, 100)}%`
                                                : '0%'
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>$0</span>
                                    <span>${source.expected.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Insights */}
            <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                <h4 className="text-md font-semibold text-white mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
                    Financial Insights
                </h4>
                <div className="text-sm text-gray-300 space-y-1">
                    {incomeAnalysis.totals.variance > 0 && (
                        <p>• Excellent! Your income is ${incomeAnalysis.totals.variance.toLocaleString()} above expectations.</p>
                    )}
                    {incomeAnalysis.totals.variance < 0 && (
                        <p>• Your income is ${Math.abs(incomeAnalysis.totals.variance).toLocaleString()} below expectations. Consider additional income sources.</p>
                    )}

                    {incomeAnalysis.sources.some(s => s.isOnTarget) && (
                        <p>• {incomeAnalysis.sources.filter(s => s.isOnTarget).length} income source(s) are meeting targets.</p>
                    )}

                    {incomeAnalysis.sources.some(s => s.status === 'negative' && !s.isOnTarget) && (
                        <p>• Consider reviewing underperforming income sources for optimization opportunities.</p>
                    )}

                    {incomeAnalysis.totals.actual === 0 && (
                        <p>• No income recorded for {currentMonth.name}. Add income entries to see variance analysis.</p>
                    )}
                </div>
            </div>

            {/* Alfred Quote */}
            {incomeAnalysis.sources.every(s => s.isOnTarget) && (
                <div className="mt-4 p-4 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
                    <p className="text-sm text-gray-300 italic text-center">
                        "Consistency in income is the foundation of any great fortune, Master Wayne."
                        <span className="text-yellow-400 block mt-1">- Alfred Pennyworth</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default IncomeVariance;
