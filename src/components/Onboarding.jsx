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
  Sparkles,
  Star,
  Award,
  Zap
} from 'lucide-react';

const Onboarding = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [foundEasterEggs, setFoundEasterEggs] = useState(new Set());

  const discoverEasterEgg = (eggId) => {
    setFoundEasterEggs(prev => new Set([...prev, eggId]));
  };

  const steps = [
    {
      title: "Welcome to Wayne Manor's Financial Wing! 🦇",
      subtitle: "Alfred Pennyworth at your service, Master Wayne",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto border-2 border-yellow-400"
            style={{ background: 'linear-gradient(135deg, #1a1a1a, #333333)' }}>
            <span className="text-3xl">🦇</span>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-300">
              "Master Wayne, I've prepared a comprehensive financial management system worthy of the Wayne family legacy."
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-yellow-400">
                <Check className="w-4 h-4" />
                <span>Butler-level expense tracking</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-400">
                <Check className="w-4 h-4" />
                <span>Wayne Enterprises budget tools</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-400">
                <Check className="w-4 h-4" />
                <span>Batcave-level analytics</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-400">
                <Check className="w-4 h-4" />
                <span>Manor record exports</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg p-4 border" style={{ backgroundColor: '#1a1a1a', borderColor: '#fbbf24' }}>
            <p className="text-yellow-400 text-sm">
              🦇 <strong>Butler's Secret:</strong> I've hidden special Wayne family Easter eggs throughout this tour.
              Complete all steps to unlock the <strong>Bat-Signal achievement!</strong>
            </p>
          </div>
          <div className="text-xs text-gray-500 italic cursor-pointer"
            onClick={() => discoverEasterEgg('wayne-tech')}
            title="Click me!">
            💡 Easter Egg #1: Look for the hidden "Wayne Tech" references in each step
          </div>
        </div>
      )
    },
    {
      title: "Financial Command Center",
      subtitle: "Your personal Batcave for financial surveillance",
      content: (
        <div className="space-y-6">
          <div className="rounded-xl p-6 border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333', background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)' }}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
                <BarChart3 className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Command Center Features</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Monthly income tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-300">Expense surveillance</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <PiggyBank className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Wayne-level profit analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Strategic savings rate</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-300">
            Your dashboard provides real-time financial surveillance with the precision of Wayne Tech monitoring systems.
          </p>
          <div className="text-center">
            <button
              className="text-yellow-400 text-xs hover:text-yellow-300 transition-colors"
              onClick={() => discoverEasterEgg('batman-quote')}
            >
              🦇 "I am the night... and the budget!" - Click for Easter Egg #2
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Track Your Manor Expenses",
      subtitle: "Every butler knows: precision in records, perfection in management",
      content: (
        <div className="space-y-6">
          <div className="rounded-xl p-6 border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
                <Receipt className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Expense Management</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Categorize expenses like Wayne Manor departments</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Smart vendor tracking (including Bat-gadget suppliers 😉)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Payment method tracking with credit card optimization</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Cash back calculation (even Bruce Wayne loves rewards!)</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg p-4 border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
            <div className="flex items-center space-x-2 mb-2">
              <Calculator className="w-4 h-4 text-yellow-400" />
              <span className="font-medium text-white">Pro Tip from Alfred:</span>
            </div>
            <p className="text-sm text-gray-300">
              Use the cash back calculator to track rewards from your credit cards automatically!
              <span
                className="ml-2 text-yellow-400 cursor-pointer hover:text-yellow-300"
                onClick={() => discoverEasterEgg('alfred-tip')}
              >
                (Click here for Alfred's secret expense tip! 🎩)
              </span>
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Manage Your Wayne Enterprises Income",
      subtitle: "Track all your income sources like a true Wayne",
      content: (
        <div className="space-y-6">
          <div className="rounded-xl p-6 border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Income Management</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Multiple income sources (Wayne Enterprises dividends, freelance, etc.)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Recurring income tracking with butler-level precision</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Expected vs actual income comparison (Alfred's favorite feature)</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300">
            Set up your income sources to get accurate profit calculations and savings rate analysis worthy of Wayne Manor's standards.
          </p>
          <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
            <p className="text-xs text-gray-400 mb-2">🦇 Hidden Wayne Tech Feature:</p>
            <button
              className="text-yellow-400 text-sm hover:text-yellow-300 transition-colors"
              onClick={() => discoverEasterEgg('wayne-dividends')}
            >
              Income variance analysis tracks your earnings like Wayne Enterprises stock portfolio!
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Advanced Financial Intelligence",
      subtitle: "Analytics worthy of the World's Greatest Detective",
      content: (
        <div className="space-y-6">
          <div className="rounded-xl p-6 border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Financial Intelligence</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Spending trends analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Budget variance tracking</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Payment method insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Export for Wayne accountants</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg p-4 border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="font-medium text-white">Batman's Secret:</span>
            </div>
            <p className="text-sm text-gray-300">
              The advanced analytics can detect spending patterns faster than Batman can solve a case!
              <span
                className="ml-1 text-yellow-400 cursor-pointer hover:text-yellow-300"
                onClick={() => discoverEasterEgg('detective-mode')}
              >
                Click to activate Detective Mode! 🔍
              </span>
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Wayne Manor Financial Planning Suite",
      subtitle: "Advanced planning tools for the sophisticated Wayne lifestyle",
      content: (
        <div className="space-y-6">
          <div className="rounded-xl p-6 border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
                <PiggyBank className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Advanced Planning Suite</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                <h4 className="text-sm font-semibold text-yellow-400 mb-1">Surplus Allocation</h4>
                <p className="text-xs text-gray-300">Allocate profits to Roth IRA, Wayne Foundation donations, Batcave upgrades, and more!</p>
              </div>
              <div className="p-3 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                <h4 className="text-sm font-semibold text-yellow-400 mb-1">Balance Validation</h4>
                <p className="text-xs text-gray-300">Ensure every dollar is accounted for with Alfred-level precision</p>
              </div>
              <div className="p-3 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                <h4 className="text-sm font-semibold text-yellow-400 mb-1">Income Variance Analysis</h4>
                <p className="text-xs text-gray-300">Track expected vs actual income like Wayne Enterprises quarterly reports</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              className="text-yellow-400 text-sm hover:text-yellow-300 transition-colors px-4 py-2 border border-yellow-400 rounded-lg"
              onClick={() => discoverEasterEgg('batcave-fund')}
            >
              🦇 Discover the secret "Batcave Maintenance Fund" allocation option!
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Congratulations, Master Wayne! 🎉",
      subtitle: "Your Wayne Manor financial system is ready for service",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto border-2 border-yellow-400"
            style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
            <Award className="w-12 h-12 text-black" />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Alfred's Final Wisdom</h3>
            <p className="text-gray-300 italic">
              "Master Wayne, you now possess a financial management system worthy of Wayne Manor itself.
              Use it wisely, and your finances will be as organized as I keep your cave."
            </p>
          </div>

          {/* Easter Egg Achievement System */}
          <div className="rounded-lg p-4 border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
            <h4 className="text-lg font-semibold text-white mb-3">🦇 Easter Egg Collection</h4>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { id: 'wayne-tech', name: 'Wayne Tech', icon: '💻' },
                { id: 'batman-quote', name: 'Batman Quote', icon: '🦇' },
                { id: 'alfred-tip', name: "Alfred's Tip", icon: '🎩' },
                { id: 'wayne-dividends', name: 'Wayne Dividends', icon: '💼' },
                { id: 'detective-mode', name: 'Detective Mode', icon: '🔍' },
                { id: 'batcave-fund', name: 'Batcave Fund', icon: '🏦' }
              ].map(egg => (
                <div key={egg.id} className={`p-2 rounded text-xs text-center border ${foundEasterEggs.has(egg.id)
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-gray-600 text-gray-500'
                  }`}>
                  <div>{egg.icon}</div>
                  <div className="text-xs mt-1">{egg.name}</div>
                  {foundEasterEggs.has(egg.id) && <Star className="w-3 h-3 mx-auto mt-1" />}
                </div>
              ))}
            </div>

            <div className="text-sm">
              <p className="text-gray-300">
                Found: {foundEasterEggs.size}/6 Easter Eggs
              </p>
              {foundEasterEggs.size === 6 ? (
                <div className="mt-2 p-2 rounded border border-yellow-400">
                  <p className="text-yellow-400 font-bold">🦇 BAT-SIGNAL ACHIEVEMENT UNLOCKED! 🦇</p>
                  <p className="text-xs text-gray-300 mt-1">
                    You've discovered all of Alfred's secrets! The Bat-Signal glows proudly over Gotham tonight.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-1">
                  Return to previous steps to find the remaining Easter eggs!
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg p-4 border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
            <p className="text-yellow-400 text-sm">
              🎯 <strong>Ready to begin?</strong> Your Wayne Manor financial command center awaits!
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const nextStep = () => {
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333', border: '1px solid' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#333333' }}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
              <span className="text-yellow-400">🦇</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Wayne Manor Financial Tutorial</h2>
              <p className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:opacity-70 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-2" style={{ backgroundColor: '#333333' }}>
          <div
            className="h-2 transition-all duration-300"
            style={{
              backgroundColor: '#fbbf24',
              width: `${((currentStep + 1) / steps.length) * 100}%`
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          <div className="p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-gray-400">
                {currentStepData.subtitle}
              </p>
            </div>

            <div className="mb-8">
              {currentStepData.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: '#333333', backgroundColor: '#0a0a0a' }}>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${currentStep === 0
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:bg-gray-700'
              }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {/* Easter Egg Counter */}
            <div className="text-xs text-gray-400 flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>{foundEasterEggs.size}/6</span>
            </div>

            {!isLastStep ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors text-black border border-yellow-400 hover:bg-yellow-500"
                style={{ backgroundColor: '#fbbf24' }}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors text-black border border-green-400 hover:bg-green-500"
                style={{ backgroundColor: '#10b981' }}
              >
                <span>Begin Service</span>
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