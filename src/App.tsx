import React, { useState, useEffect } from 'react';
import { TopNavigation } from './components/TopNavigation';
import { CountryHeader } from './components/CountryHeader';
import { AccountsExplorer } from './components/AccountsExplorer';
import { SectorBalancesView } from './components/SectorBalancesView';
import { GitHubModal } from './components/GitHubModal';
import { COUNTRIES_DATA } from './data/nationalAccounts';
import {
  AccountingApproach,
  DisplayCurrencyMode,
  getCountry,
  convertValue,
  getCurrencyLabel,
} from './data/accountsEngine';

export default function App() {
  const [countryId, setCountryId] = useState<string>('france');
  const [approach, setApproach] = useState<AccountingApproach | 'sectors'>('expenditure');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [currencyMode, setCurrencyMode] = useState<DisplayCurrencyMode>('local');
  const [activeNodeId, setActiveNodeId] = useState<string>('fr_exp_gdp');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState<boolean>(false);

  const currentCountry = getCountry(countryId);

  // When country changes, reset activeNodeId to root of current approach
  useEffect(() => {
    if (approach !== 'sectors') {
      const rootNode = currentCountry.approaches[approach];
      setActiveNodeId(rootNode.id);
    }
  }, [countryId]);

  // When approach changes, reset activeNodeId to root of new approach
  const handleSelectApproach = (newApproach: AccountingApproach | 'sectors') => {
    setApproach(newApproach);
    if (newApproach !== 'sectors') {
      const rootNode = currentCountry.approaches[newApproach];
      setActiveNodeId(rootNode.id);
    }
  };

  // Export CSV of current approach table
  const handleExportCSV = () => {
    if (approach === 'sectors') {
      alert("Sector balances table export: switch to Expenditure, Production, or Income to export full accounting hierarchy.");
      return;
    }

    const root = currentCountry.approaches[approach];
    const rows: string[] = ['ID,Code,Name,NameFr,2020,2021,2022,2023,2024,Currency'];

    function collectRows(node: any) {
      const code = node.code || '';
      const name = `"${node.name.replace(/"/g, '""')}"`;
      const nameFr = `"${(node.nameFr || '').replace(/"/g, '""')}"`;
      const y20 = node.history[2020] ?? '';
      const y21 = node.history[2021] ?? '';
      const y22 = node.history[2022] ?? '';
      const y23 = node.history[2023] ?? '';
      const y24 = node.history[2024] ?? '';
      rows.push(`${node.id},${code},${name},${nameFr},${y20},${y21},${y22},${y23},${y24},${currentCountry.currency}`);

      if (node.subComponents) {
        for (const child of node.subComponents) {
          collectRows(child);
        }
      }
    }

    collectRows(root);
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${currentCountry.id}_${approach}_accounts.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* 1-Row Top Navigation Bar */}
      <TopNavigation
        currentCountry={currentCountry}
        currentApproach={approach}
        onSelectApproach={handleSelectApproach}
        currencyMode={currencyMode}
        onSelectCurrencyMode={setCurrencyMode}
        onOpenGithubModal={() => setIsGithubModalOpen(true)}
        onExportData={handleExportCSV}
      />

      {/* Country Profile & Macroeconomics Ribbon */}
      <CountryHeader
        country={currentCountry}
        selectedYear={selectedYear}
        onSelectCountry={(newId) => {
          setCountryId(newId);
          const newCountry = getCountry(newId);
          if (approach !== 'sectors') {
            setActiveNodeId(newCountry.approaches[approach].id);
          }
        }}
        onSelectYear={setSelectedYear}
        currencyMode={currencyMode}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {approach === 'sectors' ? (
          <SectorBalancesView
            country={currentCountry}
            selectedYear={selectedYear}
            currencyMode={currencyMode}
          />
        ) : (
          <AccountsExplorer
            country={currentCountry}
            approach={approach}
            selectedYear={selectedYear}
            currencyMode={currencyMode}
            activeNodeId={activeNodeId}
            onSelectNodeId={setActiveNodeId}
          />
        )}
      </main>

      {/* Clean Footer (No fake telemetry tickers or slop) */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">National Accounts Framework</span>
            <span aria-hidden="true">·</span>
            <span>Compliant with SNA 2008 & SEC 2010</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Primary Sources: INSEE, SSB Norway, FSO Switzerland, US BEA, Destatis</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsGithubModalOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              Export to GitHub
            </button>
          </div>
        </div>
      </footer>

      {/* GitHub Repository Modal */}
      <GitHubModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />
    </div>
  );
}
