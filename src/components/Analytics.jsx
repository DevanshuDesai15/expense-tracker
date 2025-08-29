import React, { useMemo } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Calendar,
    CreditCard,
    BarChart3,
    PieChart,
    DollarSign,
    Target
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { useCategories } from '../hooks/useCategories';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Analytics = ({ expenses, incomeEntries }) => {
    const { allCategories } = useCategories();
    // Calculate data for the last 6 months
    const last6Months = useMemo(() => {
        const now = new Date();
        const sixMonthsAgo = subMonths(now, 5);
        return eachMonthOfInterval({
            start: startOfMonth(sixMonthsAgo),
            end: endOfMonth(now)
        });
    }, []);

    // Monthly trends data
    const monthlyTrends = useMemo(() => {
        const monthlyData = last6Months.map(month => {
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);

            const monthExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= monthStart && expenseDate <= monthEnd;
            });

            const monthIncome = incomeEntries.filter(income => {
                const incomeDate = new Date(income.date);
                return incomeDate >= monthStart && incomeDate <= monthEnd;
            });

            const totalExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const totalIncome = monthIncome.reduce((sum, income) => sum + income.amount, 0);

            return {
                month: format(month, 'MMM yyyy'),
                expenses: totalExpenses,
                income: totalIncome,
                savings: totalIncome - totalExpenses
            };
        });

        return monthlyData;
    }, [expenses, incomeEntries, last6Months]);

    // Payment methods breakdown
    const paymentMethodsData = useMemo(() => {
        const paymentTotals = {};
        expenses.forEach(expense => {
            const method = expense.paymentMethod || 'Unknown';
            paymentTotals[method] = (paymentTotals[method] || 0) + expense.amount;
        });
        return paymentTotals;
    }, [expenses]);

    // Spending by day of week
    const dayOfWeekData = useMemo(() => {
        const dayTotals = {
            'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0,
            'Thursday': 0, 'Friday': 0, 'Saturday': 0
        };

        expenses.forEach(expense => {
            const dayName = format(new Date(expense.date), 'EEEE');
            dayTotals[dayName] = (dayTotals[dayName] || 0) + expense.amount;
        });

        return dayTotals;
    }, [expenses]);

    // Budget variance analysis
    const budgetVariance = useMemo(() => {
        const currentMonth = new Date();
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        const monthlyExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= monthStart && expenseDate <= monthEnd;
        });

        const expensesByCategory = {};
        monthlyExpenses.forEach(expense => {
            expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
        });

        return allCategories.map(category => {
            const spent = expensesByCategory[category.id] || 0;
            const budget = category.budgetAmount;
            const variance = spent - budget;

            return {
                category: category.name,
                budget,
                spent,
                variance
            };
        }).filter(item => item.budget > 0); // Only show categories with budget
    }, [expenses]);

    // Chart configurations
    const trendsChartData = {
        labels: monthlyTrends.map(data => data.month),
        datasets: [
            {
                label: 'Wayne Enterprises Income',
                data: monthlyTrends.map(data => data.income),
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Manor Expenses',
                data: monthlyTrends.map(data => data.expenses),
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Bat-Savings',
                data: monthlyTrends.map(data => data.savings),
                borderColor: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const paymentMethodsChartData = {
        labels: Object.keys(paymentMethodsData),
        datasets: [{
            data: Object.values(paymentMethodsData),
            backgroundColor: [
                '#fbbf24', '#22c55e', '#4dabf7', '#ff6b6b', '#a855f7',
                '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
            ],
            borderWidth: 2,
            borderColor: '#1a1a1a'
        }]
    };

    const dayOfWeekChartData = {
        labels: Object.keys(dayOfWeekData),
        datasets: [{
            label: 'Total Spending',
            data: Object.values(dayOfWeekData),
            backgroundColor: 'rgba(251, 191, 36, 0.6)',
            borderColor: '#fbbf24',
            borderWidth: 2
        }]
    };

    const budgetVarianceChartData = {
        labels: budgetVariance.map(item => item.category),
        datasets: [
            {
                label: 'Alfred\'s Budget',
                data: budgetVariance.map(item => item.budget),
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
                borderColor: '#22c55e',
                borderWidth: 2
            },
            {
                label: 'Actual Manor Spending',
                data: budgetVariance.map(item => item.spent),
                backgroundColor: 'rgba(255, 107, 107, 0.6)',
                borderColor: '#ff6b6b',
                borderWidth: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#d1d5db',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: '#1a1a1a',
                borderColor: '#fbbf24',
                borderWidth: 1,
                titleColor: '#fbbf24',
                bodyColor: '#ffffff',
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: $${context.parsed.y?.toLocaleString() || context.parsed?.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#9ca3af'
                },
                grid: {
                    color: '#374151'
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#9ca3af',
                    callback: function (value) {
                        return '$' + value.toLocaleString();
                    }
                },
                grid: {
                    color: '#374151'
                }
            }
        }
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    color: '#d1d5db',
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                backgroundColor: '#1a1a1a',
                borderColor: '#fbbf24',
                borderWidth: 1,
                titleColor: '#fbbf24',
                bodyColor: '#ffffff',
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                    }
                }
            }
        }
    };

    // Summary stats
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = incomeEntries.reduce((sum, income) => sum + income.amount, 0);
    const avgMonthlyExpenses = monthlyTrends.length > 0
        ? monthlyTrends.reduce((sum, data) => sum + data.expenses, 0) / monthlyTrends.length
        : 0;
    const avgMonthlySavings = monthlyTrends.length > 0
        ? monthlyTrends.reduce((sum, data) => sum + data.savings, 0) / monthlyTrends.length
        : 0;

    const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle, showCurrency = true }) => {
        const iconColors = {
            blue: '#4dabf7',
            green: '#22c55e',
            red: '#ff6b6b',
            amber: '#fbbf24'
        };

        const formatValue = () => {
            if (typeof value === 'string') {
                return value;
            }
            return showCurrency ? `$${value.toLocaleString()}` : value.toLocaleString();
        };

        return (
            <div
                className="rounded-xl shadow-sm p-6 transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                    e.currentTarget.style.borderColor = '#555555';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a1a1a';
                    e.currentTarget.style.borderColor = '#333333';
                }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
                        <p className="text-2xl font-bold text-white">
                            {formatValue()}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#0a0a0a', border: `1px solid ${iconColors[color]}` }}>
                        <Icon className="w-6 h-6" style={{ color: iconColors[color] }} />
                    </div>
                </div>
            </div>
        );
    };

    if (expenses.length === 0 && incomeEntries.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Financial <span className="text-yellow-400">Intelligence</span></h1>
                    <p className="text-gray-300 mt-1">Strategic insights worthy of Wayne Enterprises</p>
                </div>

                <div className="flex items-center justify-center h-64 rounded-xl shadow-sm" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
                    <div className="text-center text-gray-400">
                        <div className="text-6xl mb-4">🦇</div>
                        <h3 className="text-xl font-semibold mb-2 text-white">No Wayne Manor Data Available</h3>
                        <p>Add some expenses and income entries to unlock Alfred's financial intelligence</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Financial <span className="text-yellow-400">Intelligence</span></h1>
                <p className="text-gray-300 mt-1">Strategic insights worthy of Wayne Enterprises</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Income"
                    value={totalIncome}
                    icon={DollarSign}
                    color="green"
                    subtitle="All time"
                />
                <StatCard
                    title="Total Expenses"
                    value={totalExpenses}
                    icon={TrendingDown}
                    color="red"
                    subtitle="All time"
                />
                <StatCard
                    title="Avg Monthly Expenses"
                    value={avgMonthlyExpenses}
                    icon={BarChart3}
                    color="blue"
                    subtitle="Last 6 months"
                />
                <StatCard
                    title="Avg Monthly Savings"
                    value={avgMonthlySavings}
                    icon={Target}
                    color={avgMonthlySavings >= 0 ? 'green' : 'red'}
                    subtitle="Last 6 months"
                />
            </div>

            {/* Financial Trends */}
            <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
                    Wayne Enterprises Financial Trends (Last 6 Months)
                </h2>
                <div className="h-80">
                    <Line data={trendsChartData} options={chartOptions} />
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-yellow-400" />
                        Spending by Payment Method
                    </h2>
                    <div className="h-64">
                        {Object.keys(paymentMethodsData).length > 0 ? (
                            <Pie data={paymentMethodsChartData} options={pieChartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <p>No payment method data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Day of Week Spending */}
                <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-yellow-400" />
                        Spending by Day of Week
                    </h2>
                    <div className="h-64">
                        <Bar data={dayOfWeekChartData} options={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                legend: {
                                    display: false
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>

            {/* Budget Variance Analysis */}
            {budgetVariance.length > 0 && (
                <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <PieChart className="w-5 h-5 mr-2 text-yellow-400" />
                        Wayne Manor Budget vs Actual Spending (Current Month)
                    </h2>
                    <div className="h-80">
                        <Bar data={budgetVarianceChartData} options={chartOptions} />
                    </div>
                </div>
            )}

            {/* Insights Panel */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #fbbf24' }}>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-yellow-400">🦇 Wayne Manor</span> Key Insights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                        <h3 className="font-semibold text-yellow-400 mb-2 flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Preferred Payment Method
                        </h3>
                        <p className="text-gray-300">
                            {Object.keys(paymentMethodsData).length > 0
                                ? Object.keys(paymentMethodsData).reduce((a, b) =>
                                    paymentMethodsData[a] > paymentMethodsData[b] ? a : b
                                )
                                : 'No Alfred data available'
                            }
                        </p>
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                        <h3 className="font-semibold text-yellow-400 mb-2 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Peak Spending Day
                        </h3>
                        <p className="text-gray-300">
                            {Object.keys(dayOfWeekData).length > 0
                                ? Object.keys(dayOfWeekData).reduce((a, b) =>
                                    dayOfWeekData[a] > dayOfWeekData[b] ? a : b
                                )
                                : 'No pattern detected'
                            }
                        </p>
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                        <h3 className="font-semibold text-yellow-400 mb-2 flex items-center">
                            <Target className="w-4 h-4 mr-2" />
                            Wayne Manor Savings Trend
                        </h3>
                        <p className="text-gray-300 flex items-center">
                            {avgMonthlySavings >= 0 ? (
                                <>
                                    <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                                    Excellent Progress
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="w-4 h-4 mr-1 text-red-400" />
                                    Needs Alfred's Attention
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Alfred's Analytics Wisdom */}
            <div className="rounded-xl shadow-lg border p-6 text-center" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                <div className="mb-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-xl">🦇</span>
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                    <span className="text-yellow-400">Alfred's</span> Intelligence Insights
                </h3>
                <p className="text-gray-300 italic max-w-xl mx-auto">
                    "Master Wayne, data without analysis is like having the Batcave without surveillance -
                    powerful tools unused. These insights reveal patterns that transform good financial decisions into great ones."
                </p>
                <p className="text-yellow-400 text-sm mt-2">- Alfred Pennyworth</p>
            </div>
        </div>
    );
};

export default Analytics;
