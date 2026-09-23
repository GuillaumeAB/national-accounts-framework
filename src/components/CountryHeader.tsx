import React from 'react';
import { Building2, Calendar, Users, Info, ExternalLink } from 'lucide-react';
import { COUNTRIES_DATA, CountryMacroProfile } from '../data/nationalAccounts';
import { DisplayCurrencyMode, convertValue, getCurrencyLabel } from '../data/accountsEngine';

interface CountryHeaderProps {
  country: CountryMacroProfile;
  selectedYear: number;
  onSelectCountry: (countryId: string) => void;
  onSelectYear: (year: number) => void;
  currencyMode: DisplayCurrencyMode;
}

export const CountryHeader: React.FC<CountryHeaderProps> = ({
  country,
  selectedYear,
  onSelectCountry,
  onSelectYear,
  currencyMode,
}) => {
  const years = [2020, 2021, 2022, 2023, 2024];
  const macro = country.macroIndicators[selectedYear] || country.macroIndicators[2024];
  const gdpVal = country.approaches.expenditure.history[selectedYear] || 0;
  const convertedGDP = convertValue(gdpVal, country, currencyMode);
  const currencyInfo = getCurrencyLabel(country, currencyMode);

  return (
    <section className="bg-slate-900 border-b border-slate-800 text-slate-200 pt-6 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Country + Year Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl select-none" aria-label={country.name}>
              {country.flag}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <select
                  value={country.id}
                  onChange={(e) => onSelectCountry(e.target.value)}
                  className="bg-slate-800 text-xl md:text-2xl font-bold text-white border border-slate-700 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {Object.values(COUNTRIES_DATA).map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-800 text-base">
                      {c.flag} {c.name} ({c.nameFr})
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-400 font-mono bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
                  {country.reportingStandard.split(' ')[0]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1.5">
                <span className="flex items-center gap-1">
                  <Building2 size={12} className="text-slate-500" />
                  {country.source}
                </span>
                <span aria-hidden="true">·</span>
                <a
                  href={country.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 hover:underline"
                >
                  Official Portal <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>

          {/* Year Selector Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400 px-2 flex items-center gap-1">
                <Calendar size={13} />
                Year:
              </span>
              {years.map((yr) => (
                <button
                  key={yr}
                  onClick={() => onSelectYear(yr)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    selectedYear === yr
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Macro Indicators Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">Nominal GDP ({selectedYear})</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">
              {convertedGDP.toLocaleString()} B {currencyInfo.symbol}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {currencyMode !== 'local' ? `Native: ${gdpVal.toLocaleString()} B ${country.currency}` : 'Current prices'}
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">GDP Per Capita</div>
            <div className="text-lg font-bold text-slate-100 font-mono mt-0.5">
              ${macro?.gdpPerCapitaUSD?.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">In current USD</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">Population</div>
            <div className="text-lg font-bold text-slate-100 font-mono mt-0.5">
              {country.populationMillions} M
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Resident inhabitants</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">Inflation (CPI)</div>
            <div className="text-lg font-bold text-slate-100 font-mono mt-0.5">
              {macro?.inflationCPI > 0 ? `+${macro?.inflationCPI}%` : `${macro?.inflationCPI}%`}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Annual consumer index</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">Unemployment</div>
            <div className="text-lg font-bold text-slate-100 font-mono mt-0.5">
              {macro?.unemploymentRate}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">ILO standard rate</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">Investment Rate (GFCF)</div>
            <div className="text-lg font-bold text-slate-100 font-mono mt-0.5">
              {macro?.investmentRatePercent}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Share of GDP</div>
          </div>
        </div>
      </div>
    </section>
  );
};
