import React from 'react';
import { PieChart, DollarSign, HelpCircle, ArrowUpRight, ArrowDownRight, Scale } from 'lucide-react';
import { CountryMacroProfile } from '../data/nationalAccounts';
import { DisplayCurrencyMode, getCurrencyLabel, getSectorBalances } from '../data/accountsEngine';

interface SectorBalancesViewProps {
  country: CountryMacroProfile;
  selectedYear: number;
  currencyMode: DisplayCurrencyMode;
}

export const SectorBalancesView: React.FC<SectorBalancesViewProps> = ({
  country,
  selectedYear,
  currencyMode,
}) => {
  const currencyInfo = getCurrencyLabel(country, currencyMode);
  const sectors = getSectorBalances(country, selectedYear, currencyMode);

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
              <span>SNA 2008 / SEC 2010</span>
              <span aria-hidden="true">·</span>
              <span>Account B.9</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Scale className="text-indigo-400" size={22} />
              Institutional Sectors Net Lending (+) / Net Borrowing (-)
            </h2>
            <div className="text-sm text-slate-400 italic">
              Capacité (+) ou Besoin (-) de financement par secteur institutionnel
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              In the System of National Accounts, every financial deficit by one sector (borrower) must be financed
              by the surplus of another sector (lender) or by the Rest of the World ($S.2$). The macroeconomic identity dictates that:
              <br />
              <code className="bg-slate-900 px-2 py-0.5 rounded text-indigo-300 font-mono text-xs mt-1 inline-block">
                B.9(Households) + B.9(Companies) + B.9(Government) + B.9(Financial) + B.9(Rest of World) = 0
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Sector Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((sec, idx) => {
          const isSurplus = sec.value >= 0;
          return (
            <div
              key={idx}
              className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-mono text-slate-400">{sec.sector.split(' ')[0]}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-0.5 ${
                      isSurplus
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                    }`}
                  >
                    {isSurplus ? (
                      <>
                        <ArrowUpRight size={12} /> Net Lender (Capacité)
                      </>
                    ) : (
                      <>
                        <ArrowDownRight size={12} /> Net Borrower (Besoin)
                      </>
                    )}
                  </span>
                </div>

                <div className="font-bold text-sm text-white">{sec.sector}</div>
                <div className="text-xs text-slate-400 italic mt-0.5">{sec.nameFr}</div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Net Flow (B.9)</div>
                  <div
                    className={`font-mono text-xl font-bold ${
                      isSurplus ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isSurplus ? `+${sec.value.toLocaleString()}` : sec.value.toLocaleString()}{' '}
                    <span className="text-xs text-slate-300 font-sans font-normal">
                      B {currencyInfo.symbol}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">% of GDP</div>
                  <div
                    className={`font-mono text-base font-bold ${
                      isSurplus ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {sec.pctGDP > 0 ? `+${sec.pctGDP}%` : `${sec.pctGDP}%`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Country Specific Insights */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 leading-relaxed">
        <span className="font-bold text-white uppercase tracking-wider text-[11px] block mb-1">
          Macroeconomic Insights for {country.name} ({selectedYear}):
        </span>
        {country.id === 'france' && (
          <p>
            France typically shows strong net savings from Households ($S.14$) and a persistent public deficit from General Government ($S.13$),
            complemented by a moderate external financing requirement ($S.2$ Rest of the world).
          </p>
        )}
        {country.id === 'norway' && (
          <p>
            Norway exhibits an extraordinary public sector net lending surplus ($S.13$), directly channeled into the Government Pension Fund Global (Oljefondet),
            counterbalanced by massive asset accumulation in the Rest of the World ($S.2$).
          </p>
        )}
        {country.id === 'switzerland' && (
          <p>
            Switzerland generates one of the world's highest household savings rates and corporate net surpluses, resulting in a large structural current account surplus
            and continuous net lending to the Rest of the World ($S.2$).
          </p>
        )}
        {country.id === 'usa' && (
          <p>
            The United States maintains significant net borrowing by General Government ($S.13$), financed by capital inflows from the Rest of the World ($S.2$),
            underpinned by the US Dollar's role as the global primary reserve asset.
          </p>
        )}
        {country.id === 'germany' && (
          <p>
            Germany maintains substantial household and corporate savings, resulting in significant net capital exports ($S.2$ net foreign asset accumulation).
          </p>
        )}
      </div>
    </div>
  );
};
