# 🌐 National Accounts Framework — Macroeconomic Explorer

> An interactive, high-precision macroeconomic dashboard visualizing the System of National Accounts (**SNA 2008 / ESA 2010**) across **France**, **Norway**, **Switzerland**, **United States**, and **Germany**, featuring multi-level hierarchical drill-down and multi-year evolution (2020–2024).

---

## 📊 Overview

National accounts form the quantitative backbone of modern macroeconomics. This application provides a full-stack, responsive explorer allowing users to inspect:

1. **Expenditure Approach (Optique Dépenses)**:
   $$\text{GDP} = C + I + G + (X - M)$$
   - **$C$ Household Consumption**: Services (housing rentals, healthcare, dining, transport) and Goods (durables, non-durables, food).
   - **$I$ Gross Capital Formation**: Gross Fixed Capital Formation (dwellings, infrastructure, R&D & software IPP, machinery) + change in inventories.
   - **$G$ General Government Consumption**: Collective services (defense, administration) + individual social transfers in kind (public healthcare, education).
   - **$X - M$ External Balance (Net Exports)**: Exports and imports of goods and services.

2. **Production Approach (Optique Production / Valeur Ajoutée)**:
   $$\text{GDP} = \sum \text{Gross Value Added (GVA)} + \text{Taxes less Subsidies on Products } (D.21 - D.31)$$
   - Market services, non-market public services, manufacturing, construction & civil engineering, agriculture, and net indirect product taxes (VAT / excise).

3. **Income Approach (Optique Revenus)**:
   $$\text{GDP} = D.1 \text{ (Compensation of Employees)} + B.2g/B.3g \text{ (Operating Surplus / Mixed Income)} + D.2 \text{ (Taxes on Production)}$$

4. **Institutional Sectors Net Lending (+) / Net Borrowing (-) ($B.9$)**:
   $$\sum B.9 = B.9(S.14) + B.9(S.11) + B.9(S.13) + B.9(S.12) + B.9(S.2) = 0$$
   - Displays real macroeconomic balances: households, non-financial companies, general government public balance, financial corporations, and rest of the world.

---

## 🏛️ Statistical Sources & Methodologies

All figures and accounting codes are grounded in official public statistical releases:
- 🇫🇷 **France**: [INSEE](https://www.insee.fr) & Eurostat (*Comptes Nationaux annuels Base 2020*)
- 🇳🇴 **Norway**: [Statistics Norway (SSB)](https://www.ssb.no) (*Nasjonalregnskap*, distinguishing Mainland from Continental Shelf petroleum extraction)
- 🇨🇭 **Switzerland**: [Federal Statistical Office (FSO / BFS / OFS)](https://www.bfs.admin.ch) & SECO
- 🇺🇸 **United States**: [Bureau of Economic Analysis (BEA)](https://www.bea.gov) (*National Income and Product Accounts - NIPA*)
- 🇩🇪 **Germany**: [Federal Statistical Office (Destatis)](https://www.destatis.de) & Deutsche Bundesbank

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation & Development
```bash
# Clone or download this project
git clone <your-repo-url>
cd national-accounts-framework

# Install dependencies
npm install

# Start development server (Node Express + Vite middleware)
npm run dev
```

Open your browser at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## 🐙 Comment Pousser ce Projet sur votre Compte GitHub

Le dépôt Git local a été initialisé et committé avec succès sur la branche `main`. Pour le publier sur votre compte GitHub personnel :

### Méthode 1 : Via l'interface GitHub (En 30 secondes)
1. Rendez-vous sur [github.com/new](https://github.com/new).
2. Créez un nouveau dépôt public ou privé (par exemple `national-accounts-framework`).
3. Dans votre terminal, lancez :
```bash
git remote add origin https://github.com/<VOTRE-IDENTIFIANT>/national-accounts-framework.git
git branch -M main
git push -u origin main
```

### Méthode 2 : En 1 seule commande avec GitHub CLI (`gh`)
Si vous utilisez la ligne de commande GitHub :
```bash
gh repo create national-accounts-framework --public --source=. --remote=origin --push
```

---

## 🛠️ Stack Technique

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion
- **Data Visualizations**: Recharts (Area charts for time-series evolution, Bar charts for categorical breakdowns)
- **Backend / API**: Node.js, Express, Vite SSR middleware
- **Icons**: Lucide React
- **Standard**: System of National Accounts (SNA 2008 / ESA 2010 / SEC 2010)
