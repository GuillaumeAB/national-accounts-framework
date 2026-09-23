import React from 'react';
import { Download, GitBranch, Globe2, Layers, DollarSign, TrendingUp, PieChart } from 'lucide-react';
import { CountryMacroProfile } from '../data/nationalAccounts';
import { AccountingApproach, DisplayCurrencyMode, getCurrencyLabel } from '../data/accountsEngine';

interface TopNavigationProps {
  currentCountry: CountryMacroProfile;
  currentApproach: AccountingApproach | 'sectors';
  onSelectApproach: (approach: AccountingApproach | 'sectors') => void;
  currencyMode: DisplayCurrencyMode;
  onSelectCurrencyMode: (mode: DisplayCurrencyMode) => void;
  onOpenGithubModal: () => void;
  onExportData: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentCountry,
  currentApproach,
  onSelectApproach,
  currencyMode,
  onSelectCurrencyMode,
  onOpenGithubModal,
  onExportData,
}) => {
  const currencyInfo = getCurrencyLabel(currentCountry, currencyMode);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-wider">
              SNA
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                National Accounts Explorer
              </span>
              <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5 font-normal">
                <span>{currentCountry.name}</span>
                <span aria-hidden="true">·</span>
                <span>{currentCountry.reportingStandard.split(' ')[0]}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-mono">Live Engine</span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Approaches) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => onSelectApproach('expenditure')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentApproach === 'expenditure'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <TrendingUp size={13} />
              <span>Expenditure (C+I+G+NX)</span>
            </button>
            <button
              onClick={() => onSelectApproach('production')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentApproach === 'production'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Layers size={13} />
              <span>Production / GVA</span>
            </button>
            <button
              onClick={() => onSelectApproach('income')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentApproach === 'income'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <DollarSign size={13} />
              <span>Income (Wages+Surplus)</span>
            </button>
            <button
              onClick={() => onSelectApproach('sectors')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentApproach === 'sectors'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <PieChart size={13} />
              <span>Sector Balances (S.11-S.15)</span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2">
            {/* Currency Mode Switch */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => onSelectCurrencyMode('local')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  currencyMode === 'local' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title={`Native currency: ${currentCountry.currency}`}
              >
                {currentCountry.currency}
              </button>
              <button
                onClick={() => onSelectCurrencyMode('usd')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  currencyMode === 'usd' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Normalize in US Dollars"
              >
                USD ($)
              </button>
              <button
                onClick={() => onSelectCurrencyMode('eur')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  currencyMode === 'eur' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Normalize in Euros"
              >
                EUR (€)
              </button>
            </div>

            {/* Export CSV */}
            <button
              onClick={onExportData}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              title="Export current national accounts table as CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            {/* GitHub Repo Button */}
            <button
              onClick={onOpenGithubModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <GitBranch size={14} />
              <span>GitHub Repo</span>
            </button>
          </div>
        </div>

        {/* Mobile Subnav for approaches */}
        <div className="md:hidden flex items-center gap-1 py-2 overflow-x-auto border-t border-slate-800 text-xs">
          <button
            onClick={() => onSelectApproach('expenditure')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentApproach === 'expenditure' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Expenditure
          </button>
          <button
            onClick={() => onSelectApproach('production')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentApproach === 'production' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Production
          </button>
          <button
            onClick={() => onSelectApproach('income')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentApproach === 'income' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => onSelectApproach('sectors')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentApproach === 'sectors' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Sectors
          </button>
        </div>
      </div>
    </header>
  );
};
