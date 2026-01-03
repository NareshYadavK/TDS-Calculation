export interface TdsRule {
  id: string;
  category: string;
  description: string;
  rate: number;
  rateUnit: '%' | 'fixed';
  threshold: number;
  reference?: string;
  thresholdNote?: string;
  specialNote?: string;
  isComplex?: boolean;
  payerType: 'specified' | 'non-specified' | 'all';
  payeeType: 'resident' | 'non-resident';
}

export interface CalculationResult {
  tdsAmount: number;
  ruleApplied: TdsRule;
  payableAmount: number;
  isAboveThreshold: boolean;
}
