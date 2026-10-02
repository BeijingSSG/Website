import { useCallback, useEffect, useRef, useState } from "react";
import { Crosshair, Flag, RotateCcw, Timer } from "lucide-react";
import { BestScore, CornerFrame, StartButton, StatCard } from "./widgets";

const LIGHTS = 5;
const ROWS = 2;
const STEP_MS = 700;
const BEST_KEY = "bestScore_precision_rt";

export default function PrecisionGame() {
  const [phase, setPhase] = useState("idle");
  const [lightsOn, setLightsOn] = useState(0);
  const [reaction, setReaction] = useState(null);
  const [last, setLast] = useState(null);
  const [best, setBest] = useState(() => Number(localStorage.getItem(BEST_KEY) || 0));
  const timers = useRef([]);
  const startedAt = useRef(0);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const recordBest = useCallback((value) => {
    setBest((current) => {
      if (current === 0 || value < current) {
        localStorage.setItem(BEST_KEY, String(value));
        return value;
      }
      return current;
    });
  }, []);

  const resetBest = () => {
    localStorage.removeItem(BEST_KEY);
    setBest(0);
  };

  const start = () => {
    clearTimers();
    setReaction(null);
    setLightsOn(0);
    setPhase("arming");
    for (let index = 1; index <= LIGHTS; index += 1) {
      timers.current.push(
        window.setTimeout(() => setLightsOn(index), index * STEP_MS),
      );
    }
    const delay = 600 + Math.random() * 2400;
    const goAt = LIGHTS * STEP_MS + delay;
    timers.current.push(
      window.setTimeout(() => {
        startedAt.current = performance.now();
        setLightsOn(0);
        setPhase("go");
      }, goAt),
    );
  };

  const clickBoard = () => {
    if (phase === "arming") {
      clearTimers();
      setPhase("jumped");
      setLightsOn(0);
    } else if (phase === "go") {
      const ms = Math.round(performance.now() - startedAt.current);
      setReaction(ms);
      setLast(ms);
      recordBest(ms);
      setPhase("result");
    }
  };

  const status = {
    idle: "READY",
    arming: "ARMING",
    go: "GO!",
    result: "DONE",
    jumped: "JUMP!",
  }[phase];

  const lightOn = (index) => (phase === "arming" ? index < lightsOn : phase === "jumped");

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="LAST" value={last != null ? `${last}` : "—"} icon={Timer} />
        <StatCard label="LIGHTS" value={`${lightsOn}/5`} icon={Flag} />
        <StatCard label="STATUS" value={status} icon={Crosshair} highlight={phase === "go"} />
        <BestScore best={best} onReset={resetBest} />
      </div>
      <div
        onClick={clickBoard}
        className={`relative w-full aspect-[16/10] border rounded-lg shadow-md overflow-hidden select-none transition-colors duration-150 ${
          phase === "go" ? "bg-emerald-500 border-emerald-500" : "bg-card border-border"
        } ${phase === "idle" ? "cursor-default" : "cursor-pointer"}`}
      >
        <CornerFrame />
        {phase === "idle" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
            <Crosshair size={40} className="text-emerald-500" />
            <p className="font-mono text-[11px] text-muted-foreground max-w-sm text-center leading-relaxed">
              F1 start sequence. 5 red lights illuminate one by one. When they
              all go out (green), click as fast as you can. Click too early =
              jump start.
            </p>
            <StartButton onClick={start} icon={Crosshair} />
          </div>
        ) : null}
        {phase === "arming" || phase === "go" || phase === "result" || phase === "jumped" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col gap-3 p-5 border-2 border-primary/40 rounded-lg bg-secondary/90 backdrop-blur-sm shadow-[0_0_24px_hsl(var(--primary)/0.25)]">
              {Array.from({ length: ROWS }).map((_, row) => (
                <div key={row} className="flex gap-3 justify-center">
                  {Array.from({ length: LIGHTS }).map((__, index) => (
                    <div
                      key={index}
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 transition-colors duration-100 ${
                        lightOn(index)
                          ? "bg-destructive border-destructive shadow-[0_0_18px_4px_hsl(var(--destructive)/0.7)] ring-2 ring-destructive/30"
                          : "bg-muted/30 border-border/60"
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <p className="font-mono text-[11px] text-muted-foreground text-center max-w-sm">
              {phase === "arming"
                ? lightsOn < 5
                  ? "Wait for the lights…"
                  : "Hold — wait for green!"
                : null}
              {phase === "go" ? (
                <span className="font-display font-black text-2xl text-emerald-50 uppercase">
                  GO! CLICK NOW
                </span>
              ) : null}
            </p>
          </div>
        ) : null}
        {phase === "result" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 bg-background/70">
            <Crosshair size={32} className="text-emerald-500" />
            <p className="font-display font-black text-4xl uppercase text-foreground tabular-nums">
              {reaction} MS
            </p>
            <div className="grid grid-cols-2 gap-3 mt-1 w-full max-w-sm">
              <div className="border border-border bg-background p-3 text-center">
                <div className="font-display font-bold text-lg text-foreground tabular-nums">
                  {best || "—"} ms
                </div>
                <div className="font-mono text-[8px] tracking-[0.15em] text-muted-foreground uppercase mt-0.5">
                  BEST
                </div>
              </div>
              <div className="border border-border bg-background p-3 text-center">
                <div className="font-display font-bold text-lg text-foreground tabular-nums">
                  {last} ms
                </div>
                <div className="font-mono text-[8px] tracking-[0.15em] text-muted-foreground uppercase mt-0.5">
                  LAST
                </div>
              </div>
            </div>
            <StartButton onClick={start} label="GO AGAIN" icon={RotateCcw} />
          </div>
        ) : null}
        {phase === "jumped" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 bg-destructive/10">
            <Flag size={32} className="text-destructive" />
            <p className="font-display font-black text-3xl uppercase text-destructive">
              JUMP START
            </p>
            <p className="font-mono text-[11px] text-muted-foreground text-center max-w-xs">
              You clicked before the lights went out. Wait for green next time.
            </p>
            <StartButton onClick={start} label="TRY AGAIN" icon={RotateCcw} />
          </div>
        ) : null}
      </div>
      <p className="font-mono text-[10px] text-muted-foreground/60 text-center mt-3">
        5 red lights light up, then all go out (green) at a random moment — click
        the instant it goes green.
      </p>
    </div>
  );
}
