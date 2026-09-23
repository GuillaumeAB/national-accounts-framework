import { COUNTRIES_DATA, CountryMacroProfile, AccountNode } from './nationalAccounts';

export type AccountingApproach = 'expenditure' | 'production' | 'income';
export type DisplayCurrencyMode = 'local' | 'usd' | 'eur';

export interface EnrichedAccountNode extends AccountNode {
  currentValue: number; // in chosen currency
  previousValue?: number;
  yoyGrowth?: number; // %
  shareOfParent?: number; // %
  shareOfGDP?: number; // %
  cagr?: number; // 2020-2024 Compound Annual Growth Rate %
  path: Array<{ id: string; name: string; code?: string }>;
}

export function getCountry(countryId: string): CountryMacroProfile {
  return COUNTRIES_DATA[countryId] || COUNTRIES_DATA['france'];
}

export function convertValue(
  valueLocal: number,
  country: CountryMacroProfile,
  currencyMode: DisplayCurrencyMode
): number {
  if (currencyMode === 'local') return valueLocal;
  if (currencyMode === 'usd') return Number((valueLocal * country.fxToUSD).toFixed(1));
  if (currencyMode === 'eur') return Number((valueLocal * country.fxToEUR).toFixed(1));
  return valueLocal;
}

export function getCurrencyLabel(country: CountryMacroProfile, currencyMode: DisplayCurrencyMode): { code: string; symbol: string } {
  if (currencyMode === 'usd') return { code: 'USD', symbol: '$' };
  if (currencyMode === 'eur') return { code: 'EUR', symbol: '€' };
  return { code: country.currency, symbol: country.currencySymbol };
}

export function findNodeAndPath(
  root: AccountNode,
  targetId: string,
  currentPath: Array<{ id: string; name: string; code?: string }> = []
): { node: AccountNode; path: Array<{ id: string; name: string; code?: string }> } | null {
  const newPath = [...currentPath, { id: root.id, name: root.name, code: root.code }];
  if (root.id === targetId) {
    return { node: root, path: newPath };
  }

  if (root.subComponents) {
    for (const sub of root.subComponents) {
      const found = findNodeAndPath(sub, targetId, newPath);
      if (found) return found;
    }
  }

  return null;
}

export function enrichNode(
  node: AccountNode,
  year: number,
  country: CountryMacroProfile,
  currencyMode: DisplayCurrencyMode,
  path: Array<{ id: string; name: string; code?: string }>,
  parentValueLocal?: number,
  gdpValueLocal?: number
): EnrichedAccountNode {
  const rawCurrent = node.history[year] ?? 0;
  const rawPrev = node.history[year - 1];
  const currentValue = convertValue(rawCurrent, country, currencyMode);
  const previousValue = rawPrev !== undefined ? convertValue(rawPrev, country, currencyMode) : undefined;
  
  const yoyGrowth = rawPrev !== undefined && rawPrev !== 0 
    ? Number((((rawCurrent - rawPrev) / Math.abs(rawPrev)) * 100).toFixed(1))
    : undefined;

  const shareOfParent = parentValueLocal && parentValueLocal !== 0
    ? Number(((rawCurrent / parentValueLocal) * 100).toFixed(1))
    : undefined;

  const shareOfGDP = gdpValueLocal && gdpValueLocal !== 0
    ? Number(((rawCurrent / gdpValueLocal) * 100).toFixed(1))
    : undefined;

  // 2020 to 2024 CAGR
  const val2020 = node.history[2020];
  const val2024 = node.history[2024];
  let cagr: number | undefined = undefined;
  if (val2020 && val2024 && val2020 > 0 && val2024 > 0) {
    cagr = Number(((Math.pow(val2024 / val2020, 1 / 4) - 1) * 100).toFixed(1));
  }

  return {
    ...node,
    currentValue,
    previousValue,
    yoyGrowth,
    shareOfParent,
    shareOfGDP,
    cagr,
    path,
  };
}

export interface SearchResultItem {
  id: string;
  name: string;
  nameFr?: string;
  code?: string;
  description: string;
  currentValue: number;
  approach: AccountingApproach;
  approachName: string;
  pathNames: string[];
}

export function searchAccounts(
  country: CountryMacroProfile,
  query: string,
  year: number,
  currencyMode: DisplayCurrencyMode
): SearchResultItem[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResultItem[] = [];

  const approaches: Array<{ key: AccountingApproach; root: AccountNode; name: string }> = [
    { key: 'expenditure', root: country.approaches.expenditure, name: 'Expenditure / Dépenses' },
    { key: 'production', root: country.approaches.production, name: 'Production / Valeur Ajoutée' },
    { key: 'income', root: country.approaches.income, name: 'Income / Revenus' },
  ];

  function traverse(node: AccountNode, approachKey: AccountingApproach, approachName: string, pathNames: string[]) {
    const currentPath = [...pathNames, node.name];
    const matchName = node.name.toLowerCase().includes(q);
    const matchNameFr = node.nameFr?.toLowerCase().includes(q) ?? false;
    const matchCode = node.code?.toLowerCase().includes(q) ?? false;
    const matchDesc = node.description.toLowerCase().includes(q);

    if (matchName || matchNameFr || matchCode || matchDesc) {
      results.push({
        id: node.id,
        name: node.name,
        nameFr: node.nameFr,
        code: node.code,
        description: node.description,
        currentValue: convertValue(node.history[year] ?? 0, country, currencyMode),
        approach: approachKey,
        approachName,
        pathNames: currentPath,
      });
    }

    if (node.subComponents) {
      for (const child of node.subComponents) {
        traverse(child, approachKey, approachName, currentPath);
      }
    }
  }

  for (const app of approaches) {
    traverse(app.root, app.key, app.name, []);
  }

  return results.slice(0, 12);
}

// Institutional Sectors Net Lending (+) / Net Borrowing (-) (B.9) simulation based on Eurostat/SSB/BEA ratios
export function getSectorBalances(country: CountryMacroProfile, year: number, currencyMode: DisplayCurrencyMode) {
  const gdp = country.approaches.expenditure.history[year] || 2500;
  
  // Specific country structural traits
  let householdB9Pct = 3.5;
  let corpB9Pct = -1.2;
  let govB9Pct = -4.5;
  let financialB9Pct = 0.8;
  
  if (country.id === 'norway') {
    govB9Pct = year === 2022 ? 26.0 : 14.5; // huge petroleum surplus
    householdB9Pct = 1.8;
    corpB9Pct = 1.2;
    financialB9Pct = 1.5;
  } else if (country.id === 'switzerland') {
    householdB9Pct = 6.2;
    corpB9Pct = 2.4;
    govB9Pct = 0.5;
    financialB9Pct = 1.8;
  } else if (country.id === 'usa') {
    govB9Pct = -6.2;
    householdB9Pct = 2.1;
    corpB9Pct = -0.5;
    financialB9Pct = 0.8;
  } else if (country.id === 'germany') {
    govB9Pct = -2.3;
    householdB9Pct = 6.5;
    corpB9Pct = 1.8;
    financialB9Pct = 0.9;
  }

  const restOfWorldB9Pct = -(householdB9Pct + corpB9Pct + govB9Pct + financialB9Pct);

  return [
    {
      sector: 'S.14 + S.15 Households & NPISH',
      nameFr: 'Ménages & ISBLM (Épargne brute)',
      value: convertValue((gdp * householdB9Pct) / 100, country, currencyMode),
      pctGDP: householdB9Pct,
      type: 'lender',
    },
    {
      sector: 'S.11 Non-Financial Corporations',
      nameFr: 'Sociétés non financières (Entreprises)',
      value: convertValue((gdp * corpB9Pct) / 100, country, currencyMode),
      pctGDP: corpB9Pct,
      type: corpB9Pct >= 0 ? 'lender' : 'borrower',
    },
    {
      sector: 'S.13 General Government',
      nameFr: 'Administrations publiques (Déficit / Excédent public)',
      value: convertValue((gdp * govB9Pct) / 100, country, currencyMode),
      pctGDP: govB9Pct,
      type: govB9Pct >= 0 ? 'lender' : 'borrower',
    },
    {
      sector: 'S.12 Financial Corporations',
      nameFr: 'Sociétés financières (Banques & Assurances)',
      value: convertValue((gdp * financialB9Pct) / 100, country, currencyMode),
      pctGDP: financialB9Pct,
      type: 'lender',
    },
    {
      sector: 'S.2 Rest of the World (External Balance)',
      nameFr: 'Reste du monde (Capacité / Besoin de financement extérieur)',
      value: convertValue((gdp * restOfWorldB9Pct) / 100, country, currencyMode),
      pctGDP: Number(restOfWorldB9Pct.toFixed(1)),
      type: restOfWorldB9Pct >= 0 ? 'lender' : 'borrower',
    },
  ];
}
