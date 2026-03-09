export interface BudgetSegment {
  label: string;
  percent: number;
  color: string;
  description?: string;
}

export interface BudgetData {
  title: string;
  fiscalYear: string;
  total: string;
  totalRaw: number; // millions
  segments: BudgetSegment[];
  sourceUrl?: string;
}

export const mesaBudget: BudgetData = {
  title: 'Mesa City Budget',
  fiscalYear: '2025-26',
  total: '$2.1 Billion',
  totalRaw: 2100,
  segments: [
    { label: 'Public Safety', percent: 37, color: '#b5651d', description: 'Police, fire, emergency services' },
    { label: 'Infrastructure', percent: 24, color: '#2a7d8c', description: 'Roads, utilities, maintenance' },
    { label: 'Parks & Rec', percent: 8, color: '#3a8f4e', description: 'Parks, recreation, community centers' },
    { label: 'Education Support', percent: 9, color: '#1e3a5f', description: 'Mesa College, libraries, programs' },
    { label: 'Admin & Services', percent: 12, color: '#7c5a3b', description: 'City administration and general services' },
    { label: 'Debt Service', percent: 6, color: '#9a6e4c', description: 'Bond repayments and financing' },
    { label: 'Other', percent: 4, color: '#b8a898', description: 'Miscellaneous city functions' },
  ],
  sourceUrl: 'https://www.mesaaz.gov/business/budget',
};
