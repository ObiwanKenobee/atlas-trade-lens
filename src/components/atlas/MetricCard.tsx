interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  barPercent?: number;
  barColor?: "primary" | "accent" | "destructive" | "foreground";
  segments?: { filled: number; total: number };
}

const changeColorMap = {
  positive: "text-success",
  negative: "text-destructive",
  neutral: "text-primary",
};

const barColorMap = {
  primary: "bg-primary",
  accent: "bg-accent",
  destructive: "bg-destructive",
  foreground: "bg-foreground",
};

const MetricCard = ({ label, value, change, changeType = "neutral", barPercent, barColor = "primary", segments }: MetricCardProps) => {
  return (
    <div className="bg-card border border-border p-4 machined-edge">
      <div className="text-[10px] font-mono text-muted-foreground tracking-widest mb-2 uppercase">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-mono font-medium tabular-nums text-foreground">{value}</span>
        {change && (
          <span className={`text-xs font-mono ${changeColorMap[changeType]}`}>{change}</span>
        )}
      </div>
      {barPercent !== undefined && (
        <div className="mt-3 h-1 bg-border overflow-hidden">
          <div
            className={`h-full ${barColorMap[barColor]} transition-all duration-700`}
            style={{ width: `${barPercent}%` }}
          />
        </div>
      )}
      {segments && (
        <div className="mt-3 flex gap-1">
          {Array.from({ length: segments.total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 ${i < segments.filled ? "bg-destructive" : "bg-border"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
