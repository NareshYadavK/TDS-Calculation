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
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (!isAboveThreshold) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-6 rounded-lg shadow-md mt-8 animate-fade-in">
        <h3 className="text-2xl font-semibold mb-3">No TDS Applicable</h3>
        <p>The transaction amount of <span className="font-bold">{formatCurrency(amount)}</span> is below the threshold of <span className="font-bold">{formatCurrency(ruleApplied.threshold)}</span> for '{ruleApplied.description}'.</p>
        {ruleApplied.reference && <p className="text-sm text-blue-600 mt-2">Reference: {ruleApplied.reference}</p>}
        {ruleApplied.thresholdNote && <p className="text-sm text-blue-600 mt-1">Note: Threshold is applied {ruleApplied.thresholdNote}.</p>}
      </div>
    );
  }
  
  if (ruleApplied.isComplex) {
     return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg shadow-md mt-8 animate-fade-in">
        <h3 className="text-2xl font-semibold mb-3">Complex Calculation</h3>
        <p className="font-semibold text-lg mb-2">{ruleApplied.description}</p>
        {ruleApplied.reference && <p className="text-sm text-yellow-700 mb-2">Reference: {ruleApplied.reference}</p>}
        <p className="text-base">{ruleApplied.specialNote}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mt-8 border border-gray-200 animate-fade-in">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Calculation Results</h3>
      <div className="space-y-4 text-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Payable Amount:</span>
          <span className="font-semibold text-gray-800">{formatCurrency(amount)}</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-gray-600">Applicable Rule:</span>
          <div className="text-right">
            <span className="font-semibold text-gray-800">{ruleApplied.description}</span>
            {ruleApplied.reference && <p className="text-sm text-gray-500">({ruleApplied.reference})</p>}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">TDS Rate:</span>
          <span className="font-semibold text-gray-800">{ruleApplied.rate}{ruleApplied.rateUnit}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Threshold:</span>
          <span className="font-semibold text-gray-800">{formatCurrency(ruleApplied.threshold)}</span>
        </div>
        <hr className="my-4"/>
        <div className="flex justify-between items-center pt-4">
          <span className="text-xl font-bold text-red-600">TDS to be Deducted:</span>
          <span className="text-2xl font-bold text-red-600">{formatCurrency(tdsAmount)}</span>
        </div>
        <div className="flex justify-between items-center text-green-700">
          <span className="text-xl font-bold">Net Amount Payable:</span>
          <span className="text-2xl font-bold">{formatCurrency(amount - tdsAmount)}</span>
        </div>
      </div>
      {(ruleApplied.thresholdNote || ruleApplied.specialNote) && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Notes:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
            {ruleApplied.thresholdNote && <li>Threshold is applied {ruleApplied.thresholdNote}.</li>}
            {ruleApplied.specialNote && <li>{ruleApplied.specialNote}</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultCard;