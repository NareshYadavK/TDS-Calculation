import React, { useState, useMemo, useEffect } from 'react';
import { TDS_RULES } from '../constants';
import { CalculationResult, TdsRule } from '../types';
import ResultCard from './ResultCard';

const TdsCalculator: React.FC = () => {
  const [payeeStatus, setPayeeStatus] = useState<'resident' | 'non-resident'>('resident');
  const [payerCategory, setPayerCategory] = useState<'specified' | 'non-specified'>('specified');
  const [selectedRuleId, setSelectedRuleId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const filteredRules = useMemo(() => {
    const rulesByPayee = TDS_RULES.filter(rule => rule.payeeType === payeeStatus);
    if (payeeStatus === 'resident') {
      return rulesByPayee.filter(rule => rule.payerType === payerCategory || rule.payerType === 'all');
    }
    return rulesByPayee;
  }, [payeeStatus, payerCategory]);

  const categories = useMemo(() => {
    const categoryMap: { [key: string]: TdsRule[] } = {};
    filteredRules.forEach(rule => {
      if (!categoryMap[rule.category]) {
        categoryMap[rule.category] = [];
      }
      categoryMap[rule.category].push(rule);
    });
    return categoryMap;
  }, [filteredRules]);

  useEffect(() => {
    const currentRuleExists = filteredRules.some(rule => rule.id === selectedRuleId);
    if ((!currentRuleExists && filteredRules.length > 0) || (payeeStatus === 'non-resident' && selectedRuleId === '')) {
      setSelectedRuleId(filteredRules[0]?.id || '');
    } else if (filteredRules.length === 0) {
      setSelectedRuleId('');
    }
  }, [payeeStatus, payerCategory, filteredRules, selectedRuleId]);
  
  const handlePayeeStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayeeStatus(e.target.value as 'resident' | 'non-resident');
    setResult(null);
    setAmount('');
  };

  const handlePayerCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayerCategory(e.target.value as 'specified' | 'non-specified');
    setResult(null);
  };
  
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setResult(null);
      return;
    }

    const rule = TDS_RULES.find(r => r.id === selectedRuleId);
    if (!rule) return;
    
    if (rule.isComplex) {
      setResult({
        tdsAmount: 0,
        payableAmount: numericAmount,
        ruleApplied: rule,
        isAboveThreshold: true,
      });
      return;
    }

    let tdsAmount = 0;
    const isAboveThreshold = numericAmount > rule.threshold;

    if (isAboveThreshold) {
      tdsAmount = (numericAmount * rule.rate) / 100;
    }

    setResult({
      tdsAmount,
      payableAmount: numericAmount - tdsAmount,
      ruleApplied: rule,
      isAboveThreshold,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">Calculate Tax Deducted at Source</h2>
        <form onSubmit={handleCalculate} className="space-y-6">
          
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Payee Status</label>
            <div className="flex items-center space-x-6 bg-gray-50 p-3 rounded-lg border">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="resident"
                  checked={payeeStatus === 'resident'}
                  onChange={handlePayeeStatusChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">Resident</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="non-resident"
                  checked={payeeStatus === 'non-resident'}
                  onChange={handlePayeeStatusChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">Non-Resident</span>
              </label>
            </div>
          </div>
          
          {payeeStatus === 'resident' && (
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Payer Category
                <div className="relative inline-block ml-2 group">
                  <span className="cursor-pointer text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <div className="absolute bottom-full mb-2 w-80 bg-gray-800 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2">
                    As per Sec 402(37), a "Specified Person" is: (a) any person, not being an individual or HUF; or (b) an individual or HUF with sales/turnover &gt; ₹1 crore (business) or gross receipts &gt; ₹50 lakh (profession) in the preceding financial year.
                    <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                  </div>
                </div>
              </label>
              <div className="flex items-center space-x-6 bg-gray-50 p-3 rounded-lg border">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="specified"
                    checked={payerCategory === 'specified'}
                    onChange={handlePayerCategoryChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">Specified Person</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="non-specified"
                    checked={payerCategory === 'non-specified'}
                    onChange={handlePayerCategoryChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">Other</span>
                </label>
              </div>
            </div>
          )}


          <div>
            <label htmlFor="paymentType" className="block text-lg font-medium text-gray-700 mb-2">
              Type of Payment
            </label>
            <select
              id="paymentType"
              value={selectedRuleId}
              onChange={(e) => {
                setSelectedRuleId(e.target.value);
                setResult(null);
              }}
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={!filteredRules.length}
            >
              {filteredRules.length > 0 ? (
                Object.keys(categories).map(category => (
                  <optgroup label={category} key={category}>
                    {categories[category].map(rule => (
                      <option key={rule.id} value={rule.id}>
                        {rule.description}
                      </option>
                    ))}
                  </optgroup>
                ))
              ) : (
                <option>No payment types available for this selection.</option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-lg font-medium text-gray-700 mb-2">
              Total Amount Payable (INR)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 text-lg">₹</span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => {
                    setAmount(e.target.value);
                    setResult(null);
                }}
                placeholder="e.g., 60000"
                className="w-full p-4 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105"
              disabled={!selectedRuleId || !amount}
            >
              Calculate TDS
            </button>
          </div>
        </form>
      </div>

      {result && <ResultCard result={result} amount={parseFloat(amount)} />}
    </div>
  );
};

export default TdsCalculator;
