import { RotateCcw, Trophy } from "lucide-react";

export function StatCard({ label, value, icon: Icon, highlight }) {
  return (
    <div
      className={`border p-3 flex items-center gap-2 rounded-md shadow-sm ${
        highlight ? "border-primary bg-primary/5" : "border-border bg-background"
      }`}
    >
      <Icon
        size={14}
        className={highlight ? "text-primary" : "text-muted-foreground"}
      />
      <div>
        <div className="font-display font-bold text-base text-foreground tabular-nums">
          {value}
        </div>
        <div className="font-mono text-[8px] tracking-[0.15em] text-muted-foreground uppercase">
          {label}
        </div>
      </div>
    </div>
  );
}

export function PressureStat({ label, value, icon: Icon, highlight }) {
  return (
    <div
      className={`border p-3 flex items-center gap-3 ${
        highlight ? "border-primary bg-primary/5" : "border-border bg-background"
      }`}
    >
      <Icon
        size={16}
        className={highlight ? "text-primary" : "text-muted-foreground"}
      />
      <div>
        <div className="font-display font-bold text-lg text-foreground tabular-nums leading-none">
          {value}
        </div>
        <div className="font-mono text-[8px] tracking-[0.15em] text-muted-foreground uppercase mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}

export function ResultStat({ label, value }) {
  return (
    <div className="border border-border bg-background p-3 text-center">
      <div className="font-display font-bold text-lg text-foreground tabular-nums">
        {value}
      </div>
      <div className="font-mono text-[8px] tracking-[0.15em] text-muted-foreground uppercase mt-0.5">
        {label}
      </div>
    </div>
  );
}

export function BestScore({ best, onReset }) {
  const reset = () => {
    if (window.confirm("Reset best score for this game?")) onReset();
  };
  return (
    <div className="border border-border bg-background p-3 flex items-center gap-2 rounded-md shadow-sm">
      <Trophy size={14} className="text-primary" />
      <div className="flex-1">
        <div className="font-display font-bold text-base text-foreground tabular-nums">
          {best}
        </div>
        <div className="font-mono text-[8px] tracking-[0.15em] text-muted-foreground uppercase">
          BEST
        </div>
      </div>
      <button
        onClick={reset}
        title="Reset best score"
        className="text-muted-foreground hover:text-destructive transition-colors"
      >
        <RotateCcw size={13} />
      </button>
    </div>
  );
}

export function CornerFrame() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{ filter: "drop-shadow(0 0 3px hsl(var(--primary)/0.55))" }}
    >
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-primary" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-primary" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary" />
    </div>
  );
}

export function StartButton({ onClick, label = "START", icon: Icon }) {
  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        onClick(event);
      }}
      className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md shadow-[0_0_22px_hsl(var(--primary)/0.55)] font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-primary/90 hover:shadow-[0_0_30px_hsl(var(--primary)/0.75)] transition-all"
    >
      {Icon ? <Icon size={14} /> : null} {label}
    </button>
  );
}
