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
    
    // Debug logging to check data flow
    console.log('Analytics Debug:', {
        expensesCount: expenses?.length || 0,
        incomeCount: incomeEntries?.length || 0,
        categoriesCount: allCategories?.length || 0,
        sampleExpense: expenses?.[0],
        sampleIncome: incomeEntries?.[0],
        expensesType: typeof expenses,
        incomeType: typeof incomeEntries
    });
    
    // Ensure data is properly initialized
    const safeExpenses = Array.isArray(expenses) ? expenses : [];
    const safeIncomeEntries = Array.isArray(incomeEntries) ? incomeEntries : [];
    const safeCategories = Array.isArray(allCategories) ? allCategories : [];
    // Calculate data for the last 6 months
    const last6Months = useMemo(() => {
        try {
            const now = new Date();
            const sixMonthsAgo = subMonths(now, 5);
            return eachMonthOfInterval({
                start: startOfMonth(sixMonthsAgo),
                end: endOfMonth(now)
            });
        } catch (error) {
            console.error('Error calculating last 6 months:', error);
            return [];
        }
    }, []);

    // Monthly trends data
    const monthlyTrends = useMemo(() => {
        if (last6Months.length === 0) return [];
        
        const monthlyData = last6Months.map(month => {
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);

            const monthExpenses = expenses.filter(expense => {
                try {
                    const expenseDate = typeof expense.date === 'string' ? new Date(expense.date) : expense.date;
                    return expenseDate >= monthStart && expenseDate <= monthEnd;
                } catch (error) {
                    console.warn('Error processing expense date in monthly trends:', expense.date, error);
                    return false;
                }
            });

            const monthIncome = incomeEntries.filter(income => {
                try {
                    const incomeDate = typeof income.date === 'string' ? new Date(income.date) : income.date;
                    return incomeDate >= monthStart && incomeDate <= monthEnd;
                } catch (error) {
                    console.warn('Error processing income date in monthly trends:', income.date, error);
                    return false;
                }
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
    }, [safeExpenses, safeIncomeEntries, last6Months]);

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
            try {
                // Handle both string and Date object formats
                const expenseDate = typeof expense.date === 'string' ? new Date(expense.date) : expense.date;
                const dayName = format(expenseDate, 'EEEE');
                dayTotals[dayName] = (dayTotals[dayName] || 0) + expense.amount;
            } catch (error) {
                console.warn('Error processing expense date for day of week:', expense.date, error);
            }
        });

        return dayTotals;
    }, [expenses]);

    // Category spending breakdown with percentages
    const categorySpending = useMemo(() => {
        const categoryTotals = {};
        
        expenses.forEach(expense => {
            const categoryId = expense.category;
            const categoryName = allCategories.find(cat => cat.id === categoryId)?.name || categoryId;
            categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + expense.amount;
        });

        const totalSpent = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
        
        return Object.entries(categoryTotals)
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [safeExpenses, safeCategories]);

    // Budget variance analysis
    const budgetVariance = useMemo(() => {
        const currentMonth = new Date();
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        const monthlyExpenses = expenses.filter(expense => {
            try {
                const expenseDate = typeof expense.date === 'string' ? new Date(expense.date) : expense.date;
                return expenseDate >= monthStart && expenseDate <= monthEnd;
            } catch (error) {
                console.warn('Error filtering monthly expenses:', expense.date, error);
                return false;
            }
        });

        const expensesByCategory = {};
        monthlyExpenses.forEach(expense => {
            expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
        });

        return allCategories.map(category => {
            const spent = expensesByCategory[category.id] || 0;
            const budget = category.budgetAmount;
            const variance = spent - budget;
            const percentageUsed = budget > 0 ? (spent / budget) * 100 : 0;

            return {
                category: category.name,
                budget,
                spent,
                variance,
                percentageUsed
            };
        }).filter(item => item.budget > 0); // Only show categories with budget
    }, [safeExpenses, safeCategories]);

    // Cash-back earnings analysis
    const cashBackAnalysis = useMemo(() => {
        const totalCashBack = expenses
            .filter(expense => expense.cashBackRate && expense.cashBackRate > 0)
            .reduce((sum, expense) => sum + (expense.amount * expense.cashBackRate / 100), 0);

        const cashBackByCard = {};
        expenses
            .filter(expense => expense.cardUsed && expense.cashBackRate > 0)
            .forEach(expense => {
                const cashBack = expense.amount * expense.cashBackRate / 100;
                cashBackByCard[expense.cardUsed] = (cashBackByCard[expense.cardUsed] || 0) + cashBack;
            });

        return {
            totalCashBack,
            cashBackByCard
        };
    }, [expenses]);

    // Vendor spending analysis
    const vendorAnalysis = useMemo(() => {
        const vendorTotals = {};
        
        expenses.forEach(expense => {
            if (expense.vendor) {
                vendorTotals[expense.vendor] = (vendorTotals[expense.vendor] || 0) + expense.amount;
            }
        });

        return Object.entries(vendorTotals)
            .map(([vendor, amount]) => ({ vendor, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10); // Top 10 vendors
    }, [expenses]);

    // Financial health score calculation
    const financialHealthScore = useMemo(() => {
        if (monthlyTrends.length === 0) return 0;

        // Use latest month data for health score calculations (already included in monthlyTrends)
        const avgSavingsRate = monthlyTrends.reduce((sum, month) => {
            const rate = month.income > 0 ? (month.savings / month.income) * 100 : 0;
            return sum + rate;
        }, 0) / monthlyTrends.length;

        // Budget adherence score
        const budgetAdherence = budgetVariance.length > 0 
            ? budgetVariance.reduce((sum, item) => {
                const adherenceScore = Math.max(0, 100 - Math.max(0, item.percentageUsed - 100));
                return sum + adherenceScore;
            }, 0) / budgetVariance.length
            : 50;

        // Income stability (lower variance = higher score)
        const incomeVariance = monthlyTrends.length > 1 
            ? monthlyTrends.reduce((variance, month, index) => {
                if (index === 0) return 0;
                const prevMonth = monthlyTrends[index - 1];
                const change = Math.abs(month.income - prevMonth.income);
                return variance + (prevMonth.income > 0 ? (change / prevMonth.income) * 100 : 0);
            }, 0) / (monthlyTrends.length - 1)
            : 0;

        const incomeStabilityScore = Math.max(0, 100 - incomeVariance);

        // Weight the components
        const savingsWeight = 0.4;
        const budgetWeight = 0.3;
        const stabilityWeight = 0.3;

        const score = (
            (Math.max(-50, Math.min(50, avgSavingsRate)) + 50) * savingsWeight +
            budgetAdherence * budgetWeight +
            incomeStabilityScore * stabilityWeight
        );

        return Math.round(Math.max(0, Math.min(100, score)));
    }, [monthlyTrends, budgetVariance]);

    // Expense velocity trends (daily spending patterns)
    const expenseVelocity = useMemo(() => {
        if (expenses.length === 0) return { dailyAverage: 0, weeklyTrend: [], monthlyVelocity: 0 };

        const last30Days = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return expenseDate >= thirtyDaysAgo;
        });

        const dailyTotals = {};
        const last7Days = [];
        const today = new Date();

        // Calculate last 7 days for weekly trend
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            last7Days.push(dateKey);
            dailyTotals[dateKey] = 0;
        }

        // Aggregate expenses by day with better date handling
        last30Days.forEach(expense => {
            try {
                // Handle both ISO strings and Date objects
                const expenseDate = typeof expense.date === 'string' ? expense.date : expense.date.toISOString();
                const dateKey = expenseDate.split('T')[0]; // Extract date part
                if (dailyTotals.hasOwnProperty(dateKey)) {
                    dailyTotals[dateKey] += expense.amount;
                }
            } catch (error) {
                console.warn('Error processing expense date:', expense.date, error);
            }
        });

        const weeklyTrend = last7Days.map(date => ({
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            amount: dailyTotals[date] || 0
        }));

        const dailyAverage = last30Days.length > 0 
            ? last30Days.reduce((sum, expense) => sum + expense.amount, 0) / 30
            : 0;

        // Calculate velocity (change in spending rate)
        const recentWeekTotal = Object.values(dailyTotals).reduce((sum, amount) => sum + amount, 0);
        const monthlyVelocity = recentWeekTotal > 0 ? (recentWeekTotal / 7) * 30 : 0;

        return { dailyAverage, weeklyTrend, monthlyVelocity };
    }, [expenses]);

    // Year-over-year comparison
    const yearOverYearComparison = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;

        const currentYearExpenses = expenses.filter(expense => {
            try {
                const expenseDate = typeof expense.date === 'string' ? new Date(expense.date) : expense.date;
                return expenseDate.getFullYear() === currentYear;
            } catch (error) {
                console.warn('Error filtering current year expenses:', expense.date, error);
                return false;
            }
        });
        const lastYearExpenses = expenses.filter(expense => {
            try {
                const expenseDate = typeof expense.date === 'string' ? new Date(expense.date) : expense.date;
                return expenseDate.getFullYear() === lastYear;
            } catch (error) {
                console.warn('Error filtering last year expenses:', expense.date, error);
                return false;
            }
        });

        const currentYearIncome = incomeEntries.filter(income => {
            try {
                const incomeDate = typeof income.date === 'string' ? new Date(income.date) : income.date;
                return incomeDate.getFullYear() === currentYear;
            } catch (error) {
                console.warn('Error filtering current year income:', income.date, error);
                return false;
            }
        });
        const lastYearIncome = incomeEntries.filter(income => {
            try {
                const incomeDate = typeof income.date === 'string' ? new Date(income.date) : income.date;
                return incomeDate.getFullYear() === lastYear;
            } catch (error) {
                console.warn('Error filtering last year income:', income.date, error);
                return false;
            }
        });

        const currentYearTotal = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const lastYearTotal = lastYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const currentYearIncomeTotal = currentYearIncome.reduce((sum, income) => sum + income.amount, 0);
        const lastYearIncomeTotal = lastYearIncome.reduce((sum, income) => sum + income.amount, 0);

        const expenseChange = lastYearTotal > 0 ? ((currentYearTotal - lastYearTotal) / lastYearTotal) * 100 : 0;
        const incomeChange = lastYearIncomeTotal > 0 ? ((currentYearIncomeTotal - lastYearIncomeTotal) / lastYearIncomeTotal) * 100 : 0;

        // Monthly breakdown for year-over-year
        const monthlyComparison = [];
        for (let month = 0; month < 12; month++) {
            const currentYearMonth = currentYearExpenses.filter(expense => {
                try {
                    const expenseDate = typeof expense.date === 'string' ? new Date(expense.date) : expense.date;
                    return expenseDate.getMonth() === month;
                } catch (error) {
                    console.warn('Error filtering monthly expenses for year comparison:', expense.date, error);
                    return false;
                }
            }).reduce((sum, expense) => sum + expense.amount, 0);

            const lastYearMonth = lastYearExpenses.filter(expense => {
                try {
                    const expenseDate = typeof expense.date === 'string' ? new Date(expense.date) : expense.date;
                    return expenseDate.getMonth() === month;
                } catch (error) {
                    console.warn('Error filtering monthly expenses for year comparison:', expense.date, error);
                    return false;
                }
            }).reduce((sum, expense) => sum + expense.amount, 0);

            monthlyComparison.push({
                month: new Date(currentYear, month, 1).toLocaleDateString('en-US', { month: 'short' }),
                currentYear: currentYearMonth,
                lastYear: lastYearMonth
            });
        }

        return {
            currentYear,
            lastYear,
            currentYearTotal,
            lastYearTotal,
            currentYearIncomeTotal,
            lastYearIncomeTotal,
            expenseChange,
            incomeChange,
            monthlyComparison,
            hasData: lastYearExpenses.length > 0 || lastYearIncome.length > 0
        };
    }, [expenses, incomeEntries]);

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

    const categorySpendingChartData = {
        labels: categorySpending.map(item => item.category),
        datasets: [{
            data: categorySpending.map(item => item.amount),
            backgroundColor: [
                '#fbbf24', '#22c55e', '#4dabf7', '#ff6b6b', '#a855f7',
                '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
                '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'
            ],
            borderWidth: 2,
            borderColor: '#1a1a1a'
        }]
    };

    const vendorChartData = {
        labels: vendorAnalysis.slice(0, 5).map(item => item.vendor),
        datasets: [{
            label: 'Total Spending',
            data: vendorAnalysis.slice(0, 5).map(item => item.amount),
            backgroundColor: 'rgba(251, 191, 36, 0.6)',
            borderColor: '#fbbf24',
            borderWidth: 2
        }]
    };

    const expenseVelocityChartData = {
        labels: expenseVelocity.weeklyTrend.map(day => day.date),
        datasets: [{
            label: 'Daily Spending',
            data: expenseVelocity.weeklyTrend.map(day => day.amount),
            backgroundColor: 'rgba(251, 191, 36, 0.2)',
            borderColor: '#fbbf24',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };

    const yearOverYearChartData = {
        labels: yearOverYearComparison.monthlyComparison.map(item => item.month),
        datasets: [
            {
                label: `${yearOverYearComparison.currentYear} Expenses`,
                data: yearOverYearComparison.monthlyComparison.map(item => item.currentYear),
                backgroundColor: 'rgba(251, 191, 36, 0.6)',
                borderColor: '#fbbf24',
                borderWidth: 2
            },
            {
                label: `${yearOverYearComparison.lastYear} Expenses`,
                data: yearOverYearComparison.monthlyComparison.map(item => item.lastYear),
                backgroundColor: 'rgba(107, 114, 128, 0.6)',
                borderColor: '#6b7280',
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
    // Calculate average monthly savings for strategic recommendations
    const avgMonthlySavings = monthlyTrends.length > 0
        ? monthlyTrends.reduce((sum, data) => sum + data.savings, 0) / monthlyTrends.length
        : 0;
    const topCategory = categorySpending.length > 0 ? categorySpending[0] : null;
    const topVendor = vendorAnalysis.length > 0 ? vendorAnalysis[0] : null;

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

    // Add data validation and improved empty state handling
    const hasValidExpenses = expenses && Array.isArray(expenses) && expenses.length > 0;
    const hasValidIncome = incomeEntries && Array.isArray(incomeEntries) && incomeEntries.length > 0;
    
    console.log('Data validation:', { hasValidExpenses, hasValidIncome, expensesType: typeof expenses, incomeType: typeof incomeEntries });
    
    if (!hasValidExpenses && !hasValidIncome) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                    title="Daily Avg Spending"
                    value={expenseVelocity.dailyAverage}
                    icon={Target}
                    color="blue"
                    subtitle="Last 30 days"
                />
                <StatCard
                    title="Financial Health"
                    value={`${financialHealthScore}/100`}
                    icon={TrendingUp}
                    color={financialHealthScore >= 70 ? 'green' : financialHealthScore >= 40 ? 'amber' : 'red'}
                    subtitle="Wayne Manor Score"
                    showCurrency={false}
                />
                <StatCard
                    title="Cash Back Earned"
                    value={cashBackAnalysis.totalCashBack}
                    icon={CreditCard}
                    color="amber"
                    subtitle="All time"
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

            {/* Expense Velocity Trends */}
            <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
                    Daily Spending Velocity (Last 7 Days)
                </h2>
                <div className="h-80">
                    {expenseVelocity.weeklyTrend.length > 0 ? (
                        <Line data={expenseVelocityChartData} options={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                legend: {
                                    display: false
                                }
                            }
                        }} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p>No recent spending data available</p>
                        </div>
                    )}
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg p-3" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                        <h4 className="text-sm font-medium text-yellow-400 mb-1">Daily Average (30 days)</h4>
                        <p className="text-lg font-semibold text-white">${expenseVelocity.dailyAverage.toFixed(2)}</p>
                    </div>
                    <div className="rounded-lg p-3" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                        <h4 className="text-sm font-medium text-yellow-400 mb-1">Weekly Total</h4>
                        <p className="text-lg font-semibold text-white">
                            ${expenseVelocity.weeklyTrend.reduce((sum, day) => sum + day.amount, 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="rounded-lg p-3" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                        <h4 className="text-sm font-medium text-yellow-400 mb-1">Projected Monthly</h4>
                        <p className="text-lg font-semibold text-white">${expenseVelocity.monthlyVelocity.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Year-over-Year Comparison */}
            {yearOverYearComparison.hasData && (
                <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-yellow-400" />
                        Year-over-Year Comparison ({yearOverYearComparison.lastYear} vs {yearOverYearComparison.currentYear})
                    </h2>
                    <div className="h-80">
                        <Bar data={yearOverYearChartData} options={chartOptions} />
                    </div>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="rounded-lg p-4" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                            <h4 className="text-sm font-medium text-yellow-400 mb-2">Expense Change</h4>
                            <p className={`text-lg font-semibold ${
                                yearOverYearComparison.expenseChange > 0 ? 'text-red-400' : 'text-green-400'
                            }`}>
                                {yearOverYearComparison.expenseChange > 0 ? '+' : ''}{yearOverYearComparison.expenseChange.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                ${Math.abs(yearOverYearComparison.currentYearTotal - yearOverYearComparison.lastYearTotal).toLocaleString()} {yearOverYearComparison.expenseChange > 0 ? 'increase' : 'decrease'}
                            </p>
                        </div>
                        <div className="rounded-lg p-4" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                            <h4 className="text-sm font-medium text-yellow-400 mb-2">Income Change</h4>
                            <p className={`text-lg font-semibold ${
                                yearOverYearComparison.incomeChange > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                                {yearOverYearComparison.incomeChange > 0 ? '+' : ''}{yearOverYearComparison.incomeChange.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                ${Math.abs(yearOverYearComparison.currentYearIncomeTotal - yearOverYearComparison.lastYearIncomeTotal).toLocaleString()} {yearOverYearComparison.incomeChange > 0 ? 'increase' : 'decrease'}
                            </p>
                        </div>
                        <div className="rounded-lg p-4" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                            <h4 className="text-sm font-medium text-yellow-400 mb-2">{yearOverYearComparison.currentYear} Total</h4>
                            <p className="text-lg font-semibold text-white">${yearOverYearComparison.currentYearTotal.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-1">Expenses this year</p>
                        </div>
                        <div className="rounded-lg p-4" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                            <h4 className="text-sm font-medium text-yellow-400 mb-2">{yearOverYearComparison.lastYear} Total</h4>
                            <p className="text-lg font-semibold text-white">${yearOverYearComparison.lastYearTotal.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-1">Expenses last year</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Spending Breakdown */}
                <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <PieChart className="w-5 h-5 mr-2 text-yellow-400" />
                        Manor Spending by Category
                    </h2>
                    <div className="h-64">
                        {categorySpending.length > 0 ? (
                            <Pie data={categorySpendingChartData} options={pieChartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <p>No category data available</p>
                            </div>
                        )}
                    </div>
                    {categorySpending.length > 0 && (
                        <div className="mt-4 max-h-32 overflow-y-auto">
                            <div className="space-y-2">
                                {categorySpending.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-300">{item.category}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-white">${item.amount.toLocaleString()}</span>
                                            <span className="text-yellow-400">({item.percentage.toFixed(1)}%)</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

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

                {/* Top Vendors */}
                <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-yellow-400" />
                        Top 5 Vendors
                    </h2>
                    <div className="h-64">
                        {vendorAnalysis.length > 0 ? (
                            <Bar data={vendorChartData} options={{
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    legend: {
                                        display: false
                                    }
                                }
                            }} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <p>No vendor data available</p>
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
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {budgetVariance.map((item, index) => (
                            <div key={index} className="rounded-lg p-4" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                                <h3 className="font-semibold text-white mb-2">{item.category}</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Budget:</span>
                                        <span className="text-green-400">${item.budget.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Spent:</span>
                                        <span className={item.spent > item.budget ? 'text-red-400' : 'text-white'}>
                                            ${item.spent.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Usage:</span>
                                        <span className={
                                            item.percentageUsed > 100 ? 'text-red-400' : 
                                            item.percentageUsed > 80 ? 'text-yellow-400' : 'text-green-400'
                                        }>
                                            {item.percentageUsed.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                item.percentageUsed > 100 ? 'bg-red-500' : 
                                                item.percentageUsed > 80 ? 'bg-yellow-400' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${Math.min(100, item.percentageUsed)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                            <PieChart className="w-4 h-4 mr-2" />
                            Top Spending Category
                        </h3>
                        <p className="text-gray-300">
                            {topCategory 
                                ? `${topCategory.category} (${topCategory.percentage.toFixed(1)}%)`
                                : 'No spending data available'
                            }
                        </p>
                        {topCategory && (
                            <p className="text-sm text-yellow-400 mt-1">${topCategory.amount.toLocaleString()}</p>
                        )}
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                        <h3 className="font-semibold text-yellow-400 mb-2 flex items-center">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Most Frequent Vendor
                        </h3>
                        <p className="text-gray-300">
                            {topVendor 
                                ? topVendor.vendor
                                : 'No vendor data available'
                            }
                        </p>
                        {topVendor && (
                            <p className="text-sm text-yellow-400 mt-1">${topVendor.amount.toLocaleString()}</p>
                        )}
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                        <h3 className="font-semibold text-yellow-400 mb-2 flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Cash Back Performance
                        </h3>
                        <p className="text-gray-300">
                            ${cashBackAnalysis.totalCashBack.toFixed(2)} earned
                        </p>
                        {Object.keys(cashBackAnalysis.cashBackByCard).length > 0 && (
                            <p className="text-sm text-yellow-400 mt-1">
                                Best: {Object.entries(cashBackAnalysis.cashBackByCard)
                                    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                            </p>
                        )}
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
                            Budget Discipline
                        </h3>
                        <p className="text-gray-300">
                            {budgetVariance.length > 0 
                                ? `${budgetVariance.filter(item => item.percentageUsed <= 100).length}/${budgetVariance.length} on track`
                                : 'No budget data'
                            }
                        </p>
                        {budgetVariance.length > 0 && (
                            <p className="text-sm text-yellow-400 mt-1">
                                {((budgetVariance.filter(item => item.percentageUsed <= 100).length / budgetVariance.length) * 100).toFixed(0)}% success rate
                            </p>
                        )}
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#0a0a0a', border: '1px solid #333333' }}>
                        <h3 className="font-semibold text-yellow-400 mb-2 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Financial Health
                        </h3>
                        <p className="text-gray-300 flex items-center">
                            {financialHealthScore >= 70 ? (
                                <>
                                    <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                                    Excellent
                                </>
                            ) : financialHealthScore >= 40 ? (
                                <>
                                    <Target className="w-4 h-4 mr-1 text-yellow-400" />
                                    Good Progress
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="w-4 h-4 mr-1 text-red-400" />
                                    Needs Attention
                                </>
                            )}
                        </p>
                        <p className="text-sm text-yellow-400 mt-1">{financialHealthScore}/100 Score</p>
                    </div>
                </div>
            </div>

            {/* Alfred's Analytics Wisdom */}
            <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-xl">🦇</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            <span className="text-yellow-400">Alfred's</span> Strategic Recommendations
                        </h3>
                        <div className="space-y-3 text-gray-300">
                            {financialHealthScore < 40 && (
                                <p className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                                    "Master Wayne, immediate attention required. Consider reviewing your spending patterns 
                                    and establishing stricter budget controls."
                                </p>
                            )}
                            {financialHealthScore >= 40 && financialHealthScore < 70 && (
                                <p className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                                    "Progress is evident, Master Wayne. Focus on optimizing your largest expense categories 
                                    and maintaining consistent saving habits."
                                </p>
                            )}
                            {financialHealthScore >= 70 && (
                                <p className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                                    "Excellent financial discipline, Master Wayne. Consider exploring investment opportunities 
                                    to further grow your wealth."
                                </p>
                            )}
                            {topCategory && topCategory.percentage > 40 && (
                                <p className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                                    "Your {topCategory.category} spending represents {topCategory.percentage.toFixed(1)}% of expenses. 
                                    Consider diversifying your spending or finding cost-saving opportunities in this area."
                                </p>
                            )}
                            {cashBackAnalysis.totalCashBack > 0 && (
                                <p className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                                    "Your credit card strategy has earned ${cashBackAnalysis.totalCashBack.toFixed(2)} in cash back. 
                                    Well done optimizing your payment methods, Master Wayne."
                                </p>
                            )}
                            {budgetVariance.length > 0 && budgetVariance.filter(item => item.percentageUsed > 100).length > 0 && (
                                <p className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                                    "Budget overruns detected in {budgetVariance.filter(item => item.percentageUsed > 100).length} categories. 
                                    Consider adjusting budgets or implementing spending controls."
                                </p>
                            )}
                            {avgMonthlyExpenses > 0 && expenseVelocity.monthlyVelocity > avgMonthlyExpenses * 1.2 && (
                                <p className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                                    "Current spending velocity suggests a monthly total of ${expenseVelocity.monthlyVelocity.toFixed(0)}, 
                                    which is {((expenseVelocity.monthlyVelocity / avgMonthlyExpenses - 1) * 100).toFixed(0)}% above your average. 
                                    Consider moderating expenses for the remainder of the month."
                                </p>
                            )}
                            {yearOverYearComparison.hasData && yearOverYearComparison.expenseChange > 15 && (
                                <p className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                                    "Your expenses have increased by {yearOverYearComparison.expenseChange.toFixed(1)}% compared to last year. 
                                    While some inflation is expected, consider reviewing your spending patterns to ensure this growth is intentional."
                                </p>
                            )}
                            {yearOverYearComparison.hasData && yearOverYearComparison.expenseChange < -10 && (
                                <p className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                                    "Excellent cost management, Master Wayne! Your expenses have decreased by {Math.abs(yearOverYearComparison.expenseChange).toFixed(1)}% 
                                    compared to last year. This disciplined approach to spending is commendable."
                                </p>
                            )}
                            {avgMonthlySavings > 0 && (
                                <p className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-3">
                                    "Your average monthly savings of ${avgMonthlySavings.toFixed(2)} demonstrates excellent financial discipline, Master Wayne. 
                                    Continue this prudent approach to wealth building."
                                </p>
                            )}
                            {avgMonthlySavings < 0 && (
                                <p className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                                    "Master Wayne, your monthly savings average is negative at ${Math.abs(avgMonthlySavings).toFixed(2)}. 
                                    Immediate budget restructuring is recommended to restore financial stability."
                                </p>
                            )}
                            <p className="italic text-sm border-t border-gray-600 pt-3 mt-4">
                                "Remember, Master Wayne: wealth is not about having a lot of money; 
                                it's about having a lot of options. These insights provide those options."
                            </p>
                        </div>
                        <p className="text-yellow-400 text-sm mt-3">- Alfred Pennyworth, Wayne Manor Butler</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
