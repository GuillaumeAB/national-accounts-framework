export type AccountItem = {
  id: string;
  name: string;
  value: number;
  subComponents?: AccountItem[];
};

export const nationalAccountsHierarchy: AccountItem = {
  id: 'gdp',
  name: 'Nominal GDP 2024',
  value: 4800,
  subComponents: [
    {
      id: 'consumption',
      name: 'Household Consumption',
      value: 2100,
      subComponents: [
        { id: 'cons_food', name: 'Food & Non-Alcoholic Beverages', value: 500 },
        { id: 'cons_housing', name: 'Housing & Utilities', value: 900 },
        { id: 'cons_other', name: 'Other Goods & Services', value: 700 },
      ],
    },
    {
      id: 'investment',
      name: 'Gross Fixed Capital Formation',
      value: 1000,
      subComponents: [
        { id: 'inv_machinery', name: 'Machinery & Equipment', value: 400 },
        { id: 'inv_construction', name: 'Construction', value: 600 },
      ],
    },
    {
      id: 'government',
      name: 'Government Consumption',
      value: 1100,
      subComponents: [
          { id: 'gov_health', name: 'Health Services', value: 500 },
          { id: 'gov_education', name: 'Education', value: 400 },
          { id: 'gov_admin', name: 'Public Administration', value: 200 },
      ]
    },
    {
      id: 'net_exports',
      name: 'Net Exports',
      value: 600,
      subComponents: [
        { id: 'exp_oil', name: 'Oil & Gas', value: 800 },
        { id: 'imp_other', name: 'Imports (Other)', value: -200 },
      ],
    },
  ],
};
