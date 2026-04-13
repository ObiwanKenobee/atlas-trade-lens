import AtlasHeader from "@/components/atlas/AtlasHeader";
import AtlasFooter from "@/components/atlas/AtlasFooter";
import MetricCard from "@/components/atlas/MetricCard";
import NetworkVisualization from "@/components/atlas/NetworkVisualization";
import PolicySimulator from "@/components/atlas/PolicySimulator";
import {
  calculateDependencyIndex,
  calculateAsymmetryScore,
  calculateShockSensitivity,
} from "@/lib/tradeData";

const kenyaDep = calculateDependencyIndex("ke");
const kenyaAsym = calculateAsymmetryScore("ke");
const kenyaShock = calculateShockSensitivity("ke");

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AtlasHeader />

      <main className="flex-1 p-6 space-y-6">
        {/* Primary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Trade Dependency Index"
            value={kenyaDep.toFixed(1)}
            change="+4.1%"
            changeType="negative"
            barPercent={kenyaDep}
            barColor="primary"
          />
          <MetricCard
            label="Trade Asymmetry Score"
            value={kenyaAsym.toFixed(1)}
            change="-0.4%"
            changeType="positive"
            barPercent={Math.min(kenyaAsym, 100)}
            barColor="accent"
          />
          <MetricCard
            label="Shock Sensitivity"
            value={kenyaShock > 15 ? "High" : kenyaShock > 8 ? "Med" : "Low"}
            change="DELTA-V"
            changeType="neutral"
            segments={{ filled: Math.ceil(kenyaShock / 6), total: 5 }}
          />
          <MetricCard
            label="Fairness Quotient"
            value="68.5"
            change="STABLE"
            changeType="neutral"
            barPercent={68.5}
            barColor="foreground"
          />
        </div>

        {/* Main Grid: Network + Simulator */}
        <div className="grid grid-cols-12 gap-6">
          <NetworkVisualization />
          <PolicySimulator />
        </div>
      </main>

      <AtlasFooter />
    </div>
  );
};

export default Index;
