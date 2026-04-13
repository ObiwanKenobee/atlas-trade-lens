import { useState } from "react";

const navItems = ["Global Network", "Policy Sim", "Equity Metrics", "Data Engine"];

const AtlasHeader = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="size-6 bg-primary machined-edge" />
          <span className="font-mono font-bold tracking-tighter text-lg uppercase text-foreground">
            Atlas // Trade.OS
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {navItems.map((item, i) => (
            <button
              key={item}
              onClick={() => setActiveTab(i)}
              className={`transition-colors ${
                i === activeTab
                  ? "text-primary border-b border-primary pb-4 mt-4"
                  : "hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[10px] font-mono text-muted-foreground leading-none">SYSTEM STATUS</span>
          <span className="text-[10px] font-mono text-success leading-none">OPERATIONAL // NODE-04</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="px-3 py-1 bg-destructive/10 border border-destructive/30">
          <span className="text-[10px] font-bold text-destructive tracking-widest uppercase">Live</span>
        </div>
      </div>
    </header>
  );
};

export default AtlasHeader;
