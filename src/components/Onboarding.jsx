import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  BarChart3, 
  Receipt, 
  DollarSign, 
  Target,
  PiggyBank,
  TrendingUp,
  Calculator,
  Download,
  Sparkles
} from 'lucide-react';

const Onboarding = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to FinanceTracker! 🎉",
      subtitle: "Your personal financial management companion",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              Take control of your finances with our comprehensive expense tracking system.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="w-4 h-4" />
                <span>Track expenses & income</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="w-4 h-4" />
                <span>Budget management</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="w-4 h-4" />
                <span>Visual analytics</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="w-4 h-4" />
                <span>Export capabilities</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Dashboard Overview",
      subtitle: "Your financial command center",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Dashboard Features</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Monthly income tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-red-600" />
                  <span className="text-sm">Expense monitoring</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <PiggyBank className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Profit calculations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Savings rate analysis</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            The dashboard provides a real-time overview of your financial health with interactive charts and key metrics.
          </p>
        </div>
      )
    },
    {
      title: "Track Your Expenses",
      subtitle: "Detailed expense management made simple",
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Receipt className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Expense Features</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">20+ predefined categories (rent, groceries, utilities, etc.)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Payment method tracking with cash back calculation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Advanced filtering by date, category, and amount</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Bulk operations and export functionality</span>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-800">Pro Tip:</span>
            </div>
            <p className="text-amber-700 text-sm mt-1">
              Use the cash back calculator to track rewards from your credit cards automatically!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Manage Your Income",
      subtitle: "Track all your income sources",
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Income Management</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Multiple income sources (paychecks, freelance, etc.)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Recurring income tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Expected vs actual income comparison</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            Set up your income sources to get accurate profit calculations and savings rate analysis.
          </p>
        </div>
      )
    },
    {
      title: "Budget Tracking",
      subtitle: "Stay on top of your spending goals",
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Smart Budget Features</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Groceries Budget</span>
                  <span>$350 / $500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Dining Budget</span>
                  <span>$95 / $120</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '79%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>On Track</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>Warning</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Over Budget</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Analytics & Insights",
      subtitle: "Understand your spending patterns",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Visual Analytics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Interactive pie charts for spending breakdown</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Monthly and yearly trend analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Budget vs actual comparison charts</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-blue-600">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export your data to Excel or PDF anytime</span>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set! 🚀",
      subtitle: "Ready to take control of your finances",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              You're ready to start your financial journey! Here's what you can do next:
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Receipt className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm font-medium">Add your first expense</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">Set up your income sources</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Explore your dashboard</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium"
          >
            Skip tour
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600">
              {currentStepData.subtitle}
            </p>
          </div>

          <div className="mb-8">
            {currentStepData.content}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            {!isLastStep ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>Get Started</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;