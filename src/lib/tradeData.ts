// Atlas Trade OS - Trade Data Engine & Simulation Logic

export interface TradeFlow {
  id: string;
  exporter: string;
  importer: string;
  sector: string;
  value: number; // in billions USD
  tariffRate: number; // percentage
  elasticity: number; // price sensitivity factor (0-1)
}

export interface CountryNode {
  id: string;
  name: string;
  region: string;
  gdp: number; // billions USD
  tradeOpenness: number; // trade/GDP ratio
  exports: number;
  imports: number;
}

export interface SimulationResult {
  country: string;
  gdpImpact: number; // percentage change
  sectorDisruption: number; // 0-100
  tradeBalanceShift: number;
  winners: boolean;
}

// Sample trade flow data (simplified real-world approximations)
export const tradeFlows: TradeFlow[] = [
  { id: "ke-eu-tea", exporter: "Kenya", importer: "EU", sector: "Agriculture", value: 1.2, tariffRate: 8.5, elasticity: 0.6 },
  { id: "ke-eu-flowers", exporter: "Kenya", importer: "EU", sector: "Agriculture", value: 0.8, tariffRate: 5.0, elasticity: 0.4 },
  { id: "cn-af-mfg", exporter: "China", importer: "Africa", sector: "Manufacturing", value: 52.0, tariffRate: 12.0, elasticity: 0.7 },
  { id: "cn-us-elec", exporter: "China", importer: "US", sector: "Electronics", value: 156.0, tariffRate: 25.0, elasticity: 0.5 },
  { id: "us-eu-tech", exporter: "US", importer: "EU", sector: "Technology", value: 89.0, tariffRate: 3.5, elasticity: 0.3 },
  { id: "eu-us-auto", exporter: "EU", importer: "US", sector: "Automotive", value: 62.0, tariffRate: 2.5, elasticity: 0.5 },
  { id: "br-cn-agri", exporter: "Brazil", importer: "China", sector: "Agriculture", value: 36.0, tariffRate: 4.0, elasticity: 0.8 },
  { id: "in-eu-text", exporter: "India", importer: "EU", sector: "Textiles", value: 8.4, tariffRate: 9.6, elasticity: 0.7 },
  { id: "ng-eu-oil", exporter: "Nigeria", importer: "EU", sector: "Energy", value: 12.0, tariffRate: 0.5, elasticity: 0.2 },
  { id: "sa-cn-oil", exporter: "Saudi Arabia", importer: "China", sector: "Energy", value: 45.0, tariffRate: 1.0, elasticity: 0.15 },
  { id: "de-cn-auto", exporter: "Germany", importer: "China", sector: "Automotive", value: 28.0, tariffRate: 15.0, elasticity: 0.45 },
  { id: "jp-us-auto", exporter: "Japan", importer: "US", sector: "Automotive", value: 42.0, tariffRate: 2.5, elasticity: 0.5 },
  { id: "au-cn-min", exporter: "Australia", importer: "China", sector: "Mining", value: 82.0, tariffRate: 2.0, elasticity: 0.3 },
  { id: "ke-pk-tea", exporter: "Kenya", importer: "Pakistan", sector: "Agriculture", value: 0.5, tariffRate: 11.0, elasticity: 0.5 },
  { id: "et-eu-coffee", exporter: "Ethiopia", importer: "EU", sector: "Agriculture", value: 0.9, tariffRate: 7.5, elasticity: 0.55 },
];

export const countries: CountryNode[] = [
  { id: "ke", name: "Kenya", region: "Africa", gdp: 110, tradeOpenness: 0.38, exports: 7.8, imports: 18.2 },
  { id: "cn", name: "China", region: "Asia", gdp: 17700, tradeOpenness: 0.37, exports: 3360, imports: 2680 },
  { id: "us", name: "US", region: "Americas", gdp: 25500, tradeOpenness: 0.25, exports: 2080, imports: 3280 },
  { id: "eu", name: "EU", region: "Europe", gdp: 16800, tradeOpenness: 0.42, exports: 2850, imports: 2720 },
  { id: "in", name: "India", region: "Asia", gdp: 3500, tradeOpenness: 0.42, exports: 451, imports: 613 },
  { id: "br", name: "Brazil", region: "Americas", gdp: 2000, tradeOpenness: 0.32, exports: 340, imports: 272 },
  { id: "ng", name: "Nigeria", region: "Africa", gdp: 440, tradeOpenness: 0.28, exports: 52, imports: 62 },
  { id: "jp", name: "Japan", region: "Asia", gdp: 4200, tradeOpenness: 0.36, exports: 756, imports: 812 },
  { id: "de", name: "Germany", region: "Europe", gdp: 4100, tradeOpenness: 0.87, exports: 1810, imports: 1380 },
  { id: "au", name: "Australia", region: "Oceania", gdp: 1700, tradeOpenness: 0.45, exports: 405, imports: 310 },
  { id: "sa", name: "Saudi Arabia", region: "Middle East", gdp: 1100, tradeOpenness: 0.62, exports: 360, imports: 195 },
  { id: "et", name: "Ethiopia", region: "Africa", gdp: 126, tradeOpenness: 0.26, exports: 4.1, imports: 16.4 },
];

// ---- ATLAS METRICS ----

export function calculateDependencyIndex(countryId: string): number {
  const country = countries.find(c => c.id === countryId);
  if (!country) return 0;
  
  const relevantFlows = tradeFlows.filter(
    f => f.exporter === country.name || f.importer === country.name
  );
  
  const totalTradeValue = relevantFlows.reduce((sum, f) => sum + f.value, 0);
  const concentrationFactors = relevantFlows.map(f => (f.value / totalTradeValue) ** 2);
  const hhi = concentrationFactors.reduce((sum, c) => sum + c, 0);
  
  return Math.min(hhi * country.tradeOpenness * 100, 100);
}

export function calculateAsymmetryScore(countryId: string): number {
  const country = countries.find(c => c.id === countryId);
  if (!country) return 0;
  
  const ratio = country.exports / country.imports;
  return Math.abs(1 - ratio) * 100;
}

export function calculateShockSensitivity(countryId: string): number {
  const country = countries.find(c => c.id === countryId);
  if (!country) return 0;
  
  const relevantFlows = tradeFlows.filter(
    f => f.exporter === country.name || f.importer === country.name
  );
  
  const avgElasticity = relevantFlows.length > 0
    ? relevantFlows.reduce((sum, f) => sum + f.elasticity, 0) / relevantFlows.length
    : 0.5;
  
  return avgElasticity * country.tradeOpenness * 100;
}

// ---- SIMULATION ENGINE ----

export interface SimulationParams {
  targetSector: string;
  tariffChange: number; // percentage points
  exportRestrictionLevel: number; // 0-4
  targetRegion: string;
}

export function runSimulation(params: SimulationParams): SimulationResult[] {
  const { targetSector, tariffChange, exportRestrictionLevel, targetRegion } = params;
  
  const affectedFlows = tradeFlows.filter(f => {
    const sectorMatch = targetSector === "All" || f.sector === targetSector;
    const regionMatch = targetRegion === "Global" || 
      countries.find(c => c.name === f.exporter)?.region === targetRegion ||
      countries.find(c => c.name === f.importer)?.region === targetRegion;
    return sectorMatch && regionMatch;
  });
  
  const countryImpacts = new Map<string, { gdpImpact: number; disruption: number; balanceShift: number }>();
  
  for (const flow of affectedFlows) {
    const impact = flow.value * (tariffChange / 100) * flow.elasticity;
    const restrictionMultiplier = 1 + exportRestrictionLevel * 0.15;
    const adjustedImpact = impact * restrictionMultiplier;
    
    // Exporter loses from tariff increases
    const exporterData = countryImpacts.get(flow.exporter) || { gdpImpact: 0, disruption: 0, balanceShift: 0 };
    const exporterGdp = countries.find(c => c.name === flow.exporter)?.gdp || 1000;
    exporterData.gdpImpact -= (adjustedImpact / exporterGdp) * 100;
    exporterData.disruption += flow.elasticity * 20;
    exporterData.balanceShift -= adjustedImpact;
    countryImpacts.set(flow.exporter, exporterData);
    
    // Importer gains domestic production but pays more
    const importerData = countryImpacts.get(flow.importer) || { gdpImpact: 0, disruption: 0, balanceShift: 0 };
    const importerGdp = countries.find(c => c.name === flow.importer)?.gdp || 1000;
    importerData.gdpImpact -= (adjustedImpact * 0.3 / importerGdp) * 100;
    importerData.disruption += flow.elasticity * 10;
    importerData.balanceShift += adjustedImpact * 0.5;
    countryImpacts.set(flow.importer, importerData);
  }
  
  return Array.from(countryImpacts.entries()).map(([country, data]) => ({
    country,
    gdpImpact: Math.round(data.gdpImpact * 1000) / 1000,
    sectorDisruption: Math.min(Math.round(data.disruption), 100),
    tradeBalanceShift: Math.round(data.balanceShift * 100) / 100,
    winners: data.gdpImpact > 0,
  })).sort((a, b) => a.gdpImpact - b.gdpImpact);
}

export const sectors = ["All", "Agriculture", "Manufacturing", "Electronics", "Technology", "Automotive", "Energy", "Textiles", "Mining"];
export const regions = ["Global", "Africa", "Asia", "Europe", "Americas", "Middle East", "Oceania"];
