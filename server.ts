import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { COUNTRIES_DATA } from "./src/data/nationalAccounts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON middleware
  app.use(express.json());

  // Countries metadata route
  app.get("/api/countries", (_req, res) => {
    const list = Object.values(COUNTRIES_DATA).map(c => ({
      id: c.id,
      name: c.name,
      nameFr: c.nameFr,
      flag: c.flag,
      currency: c.currency,
      currencySymbol: c.currencySymbol,
      source: c.source,
      sourceUrl: c.sourceUrl,
      populationMillions: c.populationMillions,
      reportingStandard: c.reportingStandard,
    }));
    res.json(list);
  });

  // Country full profile
  app.get("/api/countries/:countryId", (req, res) => {
    const { countryId } = req.params;
    const country = COUNTRIES_DATA[countryId];
    if (!country) {
      return res.status(404).json({ error: "Country not found" });
    }
    res.json(country);
  });

  // Account node drill-down route
  app.get("/api/accounts/:countryId/:approach/:nodeId", (req, res) => {
    const { countryId, approach, nodeId } = req.params;
    const country = COUNTRIES_DATA[countryId];
    if (!country) {
      return res.status(404).json({ error: "Country not found" });
    }

    const approachKey = approach as 'expenditure' | 'production' | 'income';
    const root = country.approaches[approachKey];
    if (!root) {
      return res.status(404).json({ error: "Approach not found" });
    }

    // Helper to find node
    function findNode(node: any, target: string): any {
      if (node.id === target) return node;
      if (node.subComponents) {
        for (const child of node.subComponents) {
          const res = findNode(child, target);
          if (res) return res;
        }
      }
      return null;
    }

    const found = findNode(root, nodeId);
    if (!found) {
      return res.status(404).json({ error: "Node not found" });
    }

    res.json({
      ...found,
      country: country.name,
      currency: country.currency,
      currencySymbol: country.currencySymbol,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`National Accounts Server running on http://localhost:${PORT}`);
  });
}

startServer();

