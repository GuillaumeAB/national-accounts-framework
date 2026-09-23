import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowLeft,
  Search,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  HelpCircle,
  BarChart3,
  CornerDownRight,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { CountryMacroProfile, AccountNode } from '../data/nationalAccounts';
import {
  AccountingApproach,
  DisplayCurrencyMode,
  EnrichedAccountNode,
  convertValue,
  enrichNode,
  findNodeAndPath,
  getCurrencyLabel,
  searchAccounts,
  SearchResultItem,
} from '../data/accountsEngine';

interface AccountsExplorerProps {
  country: CountryMacroProfile;
  approach: AccountingApproach;
  selectedYear: number;
  currencyMode: DisplayCurrencyMode;
  activeNodeId: string;
  onSelectNodeId: (nodeId: string) => void;
}

const COLORS = [
  '#4f46e5', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#14b8a6', // Teal
];

export const AccountsExplorer: React.FC<AccountsExplorerProps> = ({
  country,
  approach,
  selectedYear,
  currencyMode,
  activeNodeId,
  onSelectNodeId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [chartType, setChartType] = useState<'evolution' | 'breakdown'>('evolution');

  const rootNode = country.approaches[approach];
  const foundResult = findNodeAndPath(rootNode, activeNodeId);
  const currentNode = foundResult ? foundResult.node : rootNode;
  const currentPath = foundResult ? foundResult.path : [{ id: rootNode.id, name: rootNode.name, code: rootNode.code }];

  // Parent node for relative shares
  const parentId = currentPath.length > 1 ? currentPath[currentPath.length - 2].id : undefined;
  const parentResult = parentId ? findNodeAndPath(rootNode, parentId) : null;
  const parentValueLocal = parentResult ? parentResult.node.history[selectedYear] : undefined;
  const gdpValueLocal = rootNode.history[selectedYear];

  const enrichedCurrent: EnrichedAccountNode = enrichNode(
    currentNode,
    selectedYear,
    country,
    currencyMode,
    currentPath,
    parentValueLocal,
    gdpValueLocal
  );

  const currencyInfo = getCurrencyLabel(country, currencyMode);

  // Subcomponents enriched
  const enrichedSubComponents: EnrichedAccountNode[] = (currentNode.subComponents || []).map((sub) =>
    enrichNode(
      sub,
      selectedYear,
      country,
      currencyMode,
      [...currentPath, { id: sub.id, name: sub.name, code: sub.code }],
      currentNode.history[selectedYear],
      gdpValueLocal
    )
  );

  // Historical data for chart
  const years = [2020, 2021, 2022, 2023, 2024];
  const chartData = years.map((yr) => {
    const rawVal = currentNode.history[yr] ?? 0;
    const val = convertValue(rawVal, country, currencyMode);
    return {
      year: yr.toString(),
      value: val,
      rawVal,
    };
  });

  // Breakdown chart data
  const breakdownData = enrichedSubComponents.map((sub, idx) => ({
    name: sub.name.length > 25 ? sub.name.substring(0, 22) + '...' : sub.name,
    fullName: sub.name,
    code: sub.code,
    value: Math.abs(sub.currentValue),
    actualValue: sub.currentValue,
    color: COLORS[idx % COLORS.length],
  }));

  // Search results
  const searchResults: SearchResultItem[] = searchAccounts(country, searchQuery, selectedYear, currencyMode);

  return (
    <div className="space-y-6">
      {/* Navigation Toolbar: Breadcrumb + Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Breadcrumb Trail */}
        <div className="flex items-center flex-wrap gap-1 text-xs">
          {currentPath.length > 1 && (
            <button
              onClick={() => onSelectNodeId(currentPath[currentPath.length - 2].id)}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium mr-2 px-2 py-1 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </button>
          )}

          {currentPath.map((crumb, idx) => {
            const isLast = idx === currentPath.length - 1;
            return (
              <span key={crumb.id} className="flex items-center">
                {idx > 0 && <ChevronRight size={13} className="text-slate-600 mx-1 shrink-0" />}
                <button
                  onClick={() => onSelectNodeId(crumb.id)}
                  disabled={isLast}
                  className={`px-2 py-1 rounded transition-colors truncate max-w-[200px] sm:max-w-xs ${
                    isLast
                      ? 'bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={crumb.name}
                >
                  {crumb.code && <span className="font-mono text-[10px] mr-1 text-slate-500">[{crumb.code}]</span>}
                  {crumb.name}
                </button>
              </span>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[280px]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search category, code (P.3, FBCF), keyword..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchResults && searchQuery.trim().length >= 2 && (
            <div className="absolute right-0 mt-2 w-full sm:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-40 max-h-80 overflow-y-auto p-2">
              <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 border-b border-slate-700 flex justify-between">
                <span>Matching Accounts ({searchResults.length})</span>
                <button
                  onClick={() => setShowSearchResults(false)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  Close
                </button>
              </div>
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No accounts found matching "{searchQuery}"
                </div>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={`${item.approach}-${item.id}`}
                    onClick={() => {
                      onSelectNodeId(item.id);
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-700 transition-colors border-b border-slate-700/40 last:border-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-slate-100 truncate">
                        {item.name}
                      </span>
                      <span className="font-mono text-xs text-indigo-400 font-bold shrink-0">
                        {item.currentValue.toLocaleString()} B {currencyInfo.symbol}
                      </span>
                    </div>
                    {item.nameFr && (
                      <div className="text-[11px] text-slate-400 italic truncate">{item.nameFr}</div>
                    )}
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                      {item.code && (
                        <span className="font-mono bg-slate-900 px-1 py-0.5 rounded text-slate-400">
                          {item.code}
                        </span>
                      )}
                      <span>{item.pathNames.join(' › ')}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Focus Card: Current Active Category */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Node Meta */}
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
              {enrichedCurrent.code && (
                <span className="font-mono bg-slate-900 text-indigo-400 px-2 py-0.5 rounded border border-slate-700">
                  Code: {enrichedCurrent.code}
                </span>
              )}
              <span>{country.name} National Accounts</span>
              <span aria-hidden="true">·</span>
              <span>ESA 2010</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {enrichedCurrent.name}
            </h2>
            {enrichedCurrent.nameFr && (
              <div className="text-sm text-slate-400 italic mt-0.5">
                {enrichedCurrent.nameFr}
              </div>
            )}
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {enrichedCurrent.description}
            </p>

            {/* Metrics Chips */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-700/60 text-xs">
              {enrichedCurrent.yoyGrowth !== undefined && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">YoY ({selectedYear - 1}→{selectedYear}):</span>
                  <span
                    className={`font-mono font-bold ${
                      enrichedCurrent.yoyGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {enrichedCurrent.yoyGrowth >= 0 ? `+${enrichedCurrent.yoyGrowth}%` : `${enrichedCurrent.yoyGrowth}%`}
                  </span>
                </div>
              )}

              {enrichedCurrent.shareOfParent !== undefined && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Share of Parent:</span>
                  <span className="font-mono font-bold text-indigo-300">
                    {enrichedCurrent.shareOfParent}%
                  </span>
                </div>
              )}

              {enrichedCurrent.shareOfGDP !== undefined && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Share of GDP:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {enrichedCurrent.shareOfGDP}%
                  </span>
                </div>
              )}

              {enrichedCurrent.cagr !== undefined && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">2020-2024 CAGR:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {enrichedCurrent.cagr >= 0 ? `+${enrichedCurrent.cagr}%` : `${enrichedCurrent.cagr}%`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Big Value Display */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700/80 lg:min-w-[260px] text-right flex flex-col justify-between">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Total Recorded ({selectedYear})
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono my-2 tracking-tight">
              {enrichedCurrent.currentValue.toLocaleString()}{' '}
              <span className="text-lg text-indigo-400 font-sans font-medium">
                B {currencyInfo.symbol}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {currencyMode !== 'local' ? (
                <span>Converted from {currentNode.history[selectedYear]?.toLocaleString()} B {country.currency}</span>
              ) : (
                <span>National currency: {country.currency}</span>
              )}
            </div>
          </div>
        </div>

        {/* Visual Chart Section: Timeline or Subcomponent Breakdown */}
        <div className="mt-6 pt-6 border-t border-slate-700/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartType('evolution')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  chartType === 'evolution'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp size={13} />
                <span>Historical Evolution (2020–2024)</span>
              </button>

              {enrichedSubComponents.length > 0 && (
                <button
                  onClick={() => setChartType('breakdown')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    chartType === 'breakdown'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 size={13} />
                  <span>Component Breakdown ({selectedYear})</span>
                </button>
              )}
            </div>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Values in Billion {currencyInfo.code}
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
            {chartType === 'evolution' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                  <XAxis
                    dataKey="year"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#475569' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#475569' }}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${Number(val).toLocaleString()} B ${currencyInfo.symbol}`, 'Value']}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorVal)"
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#818cf8' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={breakdownData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, _name: any, item: any) => [
                      `${Number(item.payload.actualValue).toLocaleString()} B ${currencyInfo.symbol}`,
                      item.payload.fullName,
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Subcomponents Section: The Interactive Hierarchy */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-indigo-400" />
              Sub-components breakdown ({enrichedSubComponents.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click on any category to drill down to lower-level national account classifications.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Total accounted:{' '}
            <span className="font-mono font-bold text-indigo-400">
              {enrichedSubComponents
                .reduce((sum, s) => sum + s.currentValue, 0)
                .toLocaleString()}{' '}
              B {currencyInfo.symbol}
            </span>
          </div>
        </div>

        {enrichedSubComponents.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <CornerDownRight size={20} />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">Terminal Node Reached</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              This category ({enrichedCurrent.name}) represents the lowest granular level published in this statistical table.
              Use the breadcrumb above or back button to navigate to higher levels.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrichedSubComponents.map((sub, idx) => {
              const hasChildren = sub.subComponents && sub.subComponents.length > 0;
              const childCount = sub.subComponents?.length || 0;
              const barWidth = Math.min(100, Math.max(2, Math.abs(sub.shareOfParent || 0)));

              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectNodeId(sub.id)}
                  className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-indigo-500 rounded-xl p-4 text-left transition-all group flex flex-col justify-between shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* Header: Code & Child count */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      {sub.code ? (
                        <span className="font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {sub.code}
                        </span>
                      ) : (
                        <span className="text-slate-500">Component</span>
                      )}

                      {hasChildren ? (
                        <span className="text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          {childCount} sub-levels <ChevronRight size={12} />
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Granular terminal</span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="font-semibold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {sub.name}
                    </div>
                    {sub.nameFr && (
                      <div className="text-xs text-slate-400 italic truncate mt-0.5">
                        {sub.nameFr}
                      </div>
                    )}
                  </div>

                  {/* Value and Share Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-700/60">
                    <div className="flex items-baseline justify-between">
                      <div className="font-mono font-bold text-base text-white">
                        {sub.currentValue.toLocaleString()}{' '}
                        <span className="text-xs text-indigo-400 font-sans font-normal">
                          B {currencyInfo.symbol}
                        </span>
                      </div>

                      {sub.yoyGrowth !== undefined && (
                        <div
                          className={`text-xs font-mono font-medium ${
                            sub.yoyGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {sub.yoyGrowth >= 0 ? `+${sub.yoyGrowth}%` : `${sub.yoyGrowth}%`}
                        </div>
                      )}
                    </div>

                    {/* Mini progress bar of share */}
                    {sub.shareOfParent !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Share of parent</span>
                          <span className="font-mono font-semibold text-slate-300">
                            {sub.shareOfParent}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
