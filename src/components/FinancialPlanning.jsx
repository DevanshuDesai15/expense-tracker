import React from 'react';
import PaycheckManagement from './PaycheckManagement';
import LoanPayment from './LoanPayment';
import CreditCardPayment from './CreditCardPayment';
import SavingsAllocation from './SavingsAllocation';

const FinancialPlanning = ({ incomeEntries, creditCards, loans, savingsAccounts, onAddIncome, onAddLoan, onAddCreditCard, onAddSavingsAccount }) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Financial <span className="text-yellow-400">Planning</span></h1>
                <p className="text-gray-300 mt-1">Advanced financial analysis and planning tools worthy of Wayne Manor</p>
            </div>

            {/* Paycheck Management */}
            <PaycheckManagement incomeEntries={incomeEntries} onAdd={onAddIncome} />

            {/* Loan Payments */}
            <LoanPayment loans={loans} onAdd={onAddLoan} />

            {/* Credit Card Payments */}
            <CreditCardPayment creditCards={creditCards} onAdd={onAddCreditCard} />

            {/* Savings Allocation */}
            <SavingsAllocation savingsAccounts={savingsAccounts} onAdd={onAddSavingsAccount} />

            {/* Alfred's Financial Wisdom */}
            <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                <div className="text-center">
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto flex items-center justify-center">
                            <span className="text-2xl">🦇</span>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-3">
                        <span className="text-yellow-400">Pennyworth's</span> Financial Wisdom
                    </h2>
                    <div className="max-w-2xl mx-auto space-y-4 text-gray-300">
                        <p className="italic">
                            "Master Wayne, true wealth is not merely about accumulating money, but about making every dollar work with purpose and precision."
                        </p>
                        <p className="text-sm">
                            These advanced planning tools help you allocate surplus funds, validate financial balance, and track income performance -
                            ensuring your finances are managed with the same meticulous attention to detail as Wayne Manor itself.
                        </p>
                        <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span>Surplus Allocation</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <span>Balance Validation</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                <span>Income Analysis</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialPlanning;
