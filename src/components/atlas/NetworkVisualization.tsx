import { tradeFlows, countries } from "@/lib/tradeData";

const NetworkVisualization = () => {
  // Pick top trade flows by value for visualization
  const topFlows = [...tradeFlows].sort((a, b) => b.value - a.value).slice(0, 8);

  // Position nodes in a circle
  const nodePositions = [
    { x: 20, y: 25, name: "EU" },
    { x: 75, y: 20, name: "US" },
    { x: 50, y: 50, name: "China" },
    { x: 30, y: 70, name: "Kenya" },
    { x: 80, y: 65, name: "Japan" },
    { x: 15, y: 50, name: "Brazil" },
    { x: 60, y: 80, name: "India" },
    { x: 90, y: 40, name: "Australia" },
  ];

  const getNodePos = (name: string) => nodePositions.find(n => n.name === name);

  return (
    <div className="col-span-12 lg:col-span-8 bg-card border border-border relative overflow-hidden machined-edge min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-foreground">
            Global Dependency Network
          </span>
          <div className="flex gap-1">
            <div className="size-2 bg-primary" />
            <div className="size-2 bg-accent" />
            <div className="size-2 border border-border" />
          </div>
        </div>
        <div className="text-[10px] font-mono text-muted-foreground">
          NODES: {countries.length} // EDGES: {tradeFlows.length}
        </div>
      </div>

      <div className="flex-1 control-grid relative">
        {/* SVG trade flow lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {topFlows.map((flow) => {
            const from = getNodePos(flow.exporter);
            const to = getNodePos(flow.importer);
            if (!from || !to) return null;
            const opacity = Math.min(flow.value / 160, 0.8);
            return (
              <line
                key={flow.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="hsl(var(--primary))"
                strokeWidth="0.3"
                opacity={opacity}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodePositions.map((node) => {
          const country = countries.find(c => c.name === node.name);
          const tradeVolume = country ? country.exports + country.imports : 0;
          const size = Math.max(8, Math.min(20, tradeVolume / 300));

          return (
            <div
              key={node.name}
              className="absolute group cursor-pointer"
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <div
                className="bg-primary/20 border border-primary rounded-full animate-pulse-glow"
                style={{ width: `${size}px`, height: `${size}px` }}
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-background/90 border border-border px-2 py-1 font-mono text-[10px] machined-edge opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                <div className="text-primary">{node.name}</div>
                <div className="tabular-nums text-foreground">VOL: {(tradeVolume).toFixed(0)}B</div>
                <div className="text-muted-foreground">DEP: {country ? (country.tradeOpenness * 100).toFixed(0) : 0}%</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-border bg-background/50 grid grid-cols-3 divide-x divide-border">
        <div className="px-4">
          <div className="text-[10px] text-muted-foreground uppercase mb-1">Active Nodes</div>
          <div className="font-mono text-sm text-foreground">{countries.length} / {countries.length}</div>
        </div>
        <div className="px-4">
          <div className="text-[10px] text-muted-foreground uppercase mb-1">Trade Corridors</div>
          <div className="font-mono text-sm text-success">{tradeFlows.length} ACTIVE</div>
        </div>
        <div className="px-4">
          <div className="text-[10px] text-muted-foreground uppercase mb-1">Total Volume</div>
          <div className="font-mono text-sm text-foreground">
            ${(tradeFlows.reduce((s, f) => s + f.value, 0)).toFixed(1)}B
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkVisualization;
