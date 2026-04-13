import { useEffect, useState } from "react";

const AtlasFooter = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-border bg-background px-6 py-2 flex justify-between items-center">
      <div className="flex gap-4">
        <span className="text-[10px] font-mono text-muted-foreground">LAT: -1.2921 S</span>
        <span className="text-[10px] font-mono text-muted-foreground">LON: 36.8219 E</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="size-2 bg-success rounded-full glow-success" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-foreground">
          System Active
        </span>
      </div>
      <div className="text-[10px] font-mono text-muted-foreground">
        {time.toISOString().slice(11, 19)} UTC // NAIROBI_NODE
      </div>
    </footer>
  );
};

export default AtlasFooter;
