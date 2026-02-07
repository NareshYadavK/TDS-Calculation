import React from 'react';
import { CalculationResult } from '../types';

interface ResultCardProps {
  result: CalculationResult;
  amount: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, amount }) => {
  const { tdsAmount, ruleApplied, isAboveThreshold } = result;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!isAboveThreshold) {
    return (
      <div className="bg-white border-2 border-dashed border-gray-200 p-8 rounded-3xl mt-12 flex flex-col items-center text-center animate-fade-in">
        <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Exemption Applied</h3>
        <p className="text-gray-500 max-w-md">
          The transaction amount of <span className="text-gray-900 font-bold">{formatCurrency(amount)}</span> does not exceed the threshold limit of <span className="text-gray-900 font-bold">{formatCurrency(ruleApplied.threshold)}</span> for this category.
        </p>
        <div className="mt-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full">
          Ref: {ruleApplied.reference}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl mt-12 overflow-hidden border border-gray-100 animate-fade-in">
      <div className="bg-gray-900 p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Section Analysis</span>
            <h3 className="text-2xl font-extrabold mt-1">{ruleApplied.description}</h3>
            <p className="text-gray-400 text-sm mt-1">{ruleApplied.reference}</p>
          </div>
          <div className="bg-blue-600 px-4 py-2 rounded-xl text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider opacity-70">Tax Rate</span>
            <span className="text-xl font-black">{ruleApplied.rate}%</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-gray-500">
              <span className="text-sm font-bold uppercase">Gross Payment</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span className="text-sm font-bold uppercase">Threshold Limit</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(ruleApplied.threshold)}</span>
            </div>
            <div className="h-px bg-gray-100 my-4" />
            <div className="flex justify-between items-center text-red-600">
              <span className="text-sm font-black uppercase">TDS Deductible</span>
              <span className="text-3xl font-black tracking-tight">-{formatCurrency(tdsAmount)}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl flex flex-col justify-center border border-gray-100">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Net Settlement Amount</span>
            <span className="text-4xl font-black text-gray-900 tracking-tighter">
              {formatCurrency(amount - tdsAmount)}
            </span>
            <p className="text-gray-400 text-[10px] mt-4 leading-relaxed font-medium">
              *Calculated based on the standard provisions of Sec 393. Actual deductions may vary based on specific circumstances or additional surcharges.
            </p>
          </div>
        </div>

        {(ruleApplied.thresholdNote || ruleApplied.specialNote) && (
          <div className="pt-6 border-t border-gray-100">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Compliance Notes</h4>
            <ul className="space-y-2">
              {ruleApplied.thresholdNote && (
                <li className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                  Threshold applies {ruleApplied.thresholdNote}.
                </li>
              )}
              {ruleApplied.specialNote && (
                <li className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                  {ruleApplied.specialNote}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
