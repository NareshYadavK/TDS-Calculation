import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TDS_RULES } from '../constants';
import { CalculationResult, TdsRule } from '../types';
import ResultCard from './ResultCard';

const TdsCalculator: React.FC = () => {
  const [payeeStatus, setPayeeStatus] = useState<'resident' | 'non-resident'>('resident');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRuleId, setSelectedRuleId] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('');
  const [isNonFiler, setIsNonFiler] = useState<boolean>(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredRules = useMemo(() => {
    let rules = TDS_RULES.filter(rule => rule.payeeType === payeeStatus);
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      rules = rules.filter(rule => 
        rule.description.toLowerCase().includes(lowerSearch) || 
        rule.category.toLowerCase().includes(lowerSearch) ||
        rule.reference?.toLowerCase().includes(lowerSearch)
      );
    }
    
    return rules.sort((a, b) => {
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      return a.description.localeCompare(b.description);
    });
  }, [payeeStatus, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedRule = useMemo(() => 
    TDS_RULES.find(r => r.id === selectedRuleId), 
  [selectedRuleId]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 0 || !selectedRule) {
      setResult(null);
      return;
    }

    let tdsAmount = 0;
    const threshold = selectedRule.threshold;
    
    if (numericAmount > threshold) {
      // Specialized logic based on the charts
      if (selectedRule.id === 'r_194N_cash') {
        if (isNonFiler) {
          // Tiered: 2% (20L - 1Cr), 5% (> 1Cr)
          if (numericAmount > 10000000) {
            tdsAmount = (8000000 * 0.02) + ((numericAmount - 10000000) * 0.05);
          } else if (numericAmount > 2000000) {
            tdsAmount = (numericAmount - 2000000) * 0.02;
          }
        } else {
          // Standard: 2% above 1 Crore
          tdsAmount = (numericAmount - 10000000) * 0.02;
        }
      } else if (selectedRule.id === 'r_194Q_goods') {
        // TDS only on amount exceeding 50 Lakh
        tdsAmount = (numericAmount - 5000000) * (selectedRule.rate / 100);
      } else if (selectedRule.id === 'nr_195_d_ltcg_112a') {
        // Section 112A Non-Resident: Tax on gain exceeding 1.25 Lakhs
        tdsAmount = (numericAmount - 125000) * (selectedRule.rate / 100);
      } else {
        // Standard rule: Tax on FULL amount if threshold exceeded
        tdsAmount = (numericAmount * selectedRule.rate) / 100;
      }
    }

    setResult({
      tdsAmount,
      payableAmount: numericAmount - tdsAmount,
      ruleApplied: selectedRule,
      isAboveThreshold: numericAmount > (selectedRule.id === 'r_194N_cash' && isNonFiler ? 2000000 : threshold),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-2 pb-20">
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Non-Resident TDS Engine</h2>
          <p className="text-gray-500 font-medium">Verified rates for Non-Residents & Residents (2025 Act)</p>
        </div>
        
        <form onSubmit={handleCalculate} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                Payee Status
              </label>
              <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setPayeeStatus('resident'); setSelectedRuleId(''); setResult(null); }}
                  className={`py-2 px-4 rounded-lg text-sm font-bold transition-all ${payeeStatus === 'resident' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Resident
                </button>
                <button
                  type="button"
                  onClick={() => { setPayeeStatus('non-resident'); setSelectedRuleId(''); setResult(null); }}
                  className={`py-2 px-4 rounded-lg text-sm font-bold transition-all ${payeeStatus === 'non-resident' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Non-Resident
                </button>
              </div>
            </div>

            {selectedRuleId === 'r_194N_cash' && (
              <div className="space-y-3 animate-fade-in">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  ITR Filer Status
                </label>
                <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setIsNonFiler(false); setResult(null); }}
                    className={`py-2 px-4 rounded-lg text-sm font-bold transition-all ${!isNonFiler ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Filer
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsNonFiler(true); setResult(null); }}
                    className={`py-2 px-4 rounded-lg text-sm font-bold transition-all ${isNonFiler ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Non-Filer
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Nature of Payment (Search Section or Type...)</label>
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder={payeeStatus === 'resident' ? "194C, 194J, Rent..." : "195, 194E, LTCG, IFSC..."}
                  className="w-full pl-11 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800"
                  value={searchTerm || (selectedRule ? selectedRule.description : '')}
                  onFocus={() => { setIsDropdownOpen(true); }}
                  onChange={(e) => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
                />
                {(searchTerm || selectedRule) && (
                  <button 
                    type="button"
                    onClick={() => { setSearchTerm(''); setSelectedRuleId(''); setResult(null); }}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-[450px] overflow-y-auto">
                  {filteredRules.length > 0 ? (
                    filteredRules.map((rule, idx) => {
                      const showHeader = idx === 0 || filteredRules[idx - 1].category !== rule.category;
                      return (
                        <React.Fragment key={rule.id}>
                          {showHeader && (
                            <div className="bg-gray-50 px-5 py-2 text-[10px] font-black text-blue-400 uppercase tracking-widest border-b border-gray-100 sticky top-0 z-10">
                              {rule.category}
                            </div>
                          )}
                          <button
                            type="button"
                            className={`w-full text-left px-5 py-4 hover:bg-blue-50 border-b border-gray-50 last:border-0 transition-colors group ${selectedRuleId === rule.id ? 'bg-blue-50' : ''}`}
                            onClick={() => {
                              setSelectedRuleId(rule.id);
                              setSearchTerm('');
                              setIsDropdownOpen(false);
                              setResult(null);
                            }}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <p className={`font-bold text-sm ${selectedRuleId === rule.id ? 'text-blue-700' : 'text-gray-900'}`}>
                                  {rule.description}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold mt-1">{rule.reference}</p>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="bg-white border border-gray-200 text-gray-700 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                                  {rule.rate > 0 ? `${rule.rate}%` : 'Slab'}
                                </span>
                                {rule.threshold > 0 && (
                                  <span className="text-[9px] text-gray-400 mt-1 font-medium">
                                    Limit: ₹{(rule.threshold).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <div className="px-5 py-12 text-center text-gray-500">
                      No matching sections found for {payeeStatus === 'resident' ? 'Residents' : 'Non-Residents'}.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="amount" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Payment Amount (INR)</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-300 text-xl font-light">₹</span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setResult(null); }}
                placeholder="0.00"
                className="w-full p-5 pl-10 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-2xl font-black text-gray-900"
                step="0.01"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-black py-5 px-6 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            disabled={!selectedRuleId || !amount}
          >
            CALCULATE TDS AMOUNT
          </button>
        </form>
      </div>

      {result && <ResultCard result={result} amount={parseFloat(amount)} />}
    </div>
  );
};

export default TdsCalculator;
