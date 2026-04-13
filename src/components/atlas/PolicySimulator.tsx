import { useState } from "react";
import { runSimulation, sectors, regions, type SimulationResult } from "@/lib/tradeData";

const PolicySimulator = () => {
  const [tariffChange, setTariffChange] = useState(10);
  const [restrictionLevel, setRestrictionLevel] = useState(2);
  const [sector, setSector] = useState("All");
  const [region, setRegion] = useState("Global");
  const [results, setResults] = useState<SimulationResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleSimulate = () => {
    setIsRunning(true);
    setTimeout(() => {
      const simResults = runSimulation({
        targetSector: sector,
        tariffChange,
        exportRestrictionLevel: restrictionLevel,
        targetRegion: region,
      });
      setResults(simResults);
      setIsRunning(false);
    }, 800);
  };

  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
      <div className="bg-card border border-border machined-edge flex flex-col">
        <div className="p-4 border-b border-border bg-background/50">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-foreground">
            Policy Impact Simulator
          </span>
        </div>
        <div className="p-5 space-y-5">
          {/* Sector select */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-mono text-muted-foreground">
              <span>Target Sector</span>
              <span className="text-primary">{sector}</span>
            </div>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full bg-background border border-border text-foreground text-xs font-mono p-2 focus:outline-none focus:border-primary"
            >
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Region select */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-mono text-muted-foreground">
              <span>Target Region</span>
              <span className="text-primary">{region}</span>
            </div>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-background border border-border text-foreground text-xs font-mono p-2 focus:outline-none focus:border-primary"
            >
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Tariff slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-mono text-muted-foreground">
              <span>Tariff Change</span>
              <span className="text-primary">+{tariffChange.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={tariffChange}
              onChange={(e) => setTariffChange(Number(e.target.value))}
              className="w-full h-1 bg-border accent-primary appearance-none cursor-pointer"
            />
          </div>

          {/* Export restriction level */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-mono text-muted-foreground">
              <span>Export Restrictions</span>
              <span className="text-accent">Lvl {restrictionLevel}</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[0, 1, 2, 3, 4].map(level => (
                <button
                  key={level}
                  onClick={() => setRestrictionLevel(level)}
                  className={`h-8 border text-[10px] font-mono transition-colors ${
                    level <= restrictionLevel
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={isRunning}
            className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isRunning ? "Simulating..." : "Execute Simulation"}
          </button>
        </div>

        {/* Results */}
        <div className="p-4 bg-background border-t border-border">
          <div className="text-[10px] text-muted-foreground font-mono mb-3 uppercase">
            {results ? "Simulation Results" : "Projected Outcomes"}
          </div>
          {results ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {results.slice(0, 8).map((r) => (
                <div key={r.country} className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">{r.country}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground">
                      DSR:{r.sectorDisruption}
                    </span>
                    <span className={r.gdpImpact > 0 ? "text-success" : "text-destructive"}>
                      {r.gdpImpact > 0 ? "+" : ""}{r.gdpImpact}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">GDP Variance</span>
                <span className="text-muted-foreground font-mono">—</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Supply Chain Impact</span>
                <span className="text-muted-foreground font-mono">—</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Intelligence Feed */}
      <div className="bg-card border border-border machined-edge p-4 flex-1">
        <div className="text-[10px] font-mono text-muted-foreground tracking-widest mb-4 uppercase">
          Intelligence Feed
        </div>
        <div className="space-y-4 font-mono">
          <div className="flex gap-3">
            <span className="text-primary text-[10px] shrink-0">14:22:01</span>
            <p className="text-[11px] leading-tight text-foreground">
              East African tea corridor under tariff pressure. Kenya dependency index elevated.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-accent text-[10px] shrink-0">13:58:44</span>
            <p className="text-[11px] leading-tight text-foreground">
              EU agricultural subsidy reform signals asymmetry shift for African exporters.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-success text-[10px] shrink-0">13:45:12</span>
            <p className="text-[11px] leading-tight text-foreground">
              AfCFTA implementation progress: intra-African trade volume up 2.3%.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-destructive text-[10px] shrink-0">12:31:08</span>
            <p className="text-[11px] leading-tight text-foreground">
              Semiconductor supply chain shock: TW→US corridor fragility score critical.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicySimulator;
