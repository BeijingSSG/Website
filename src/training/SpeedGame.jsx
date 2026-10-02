import { useEffect, useReducer, useRef, useState } from "react";
import { Clock, RotateCcw, Target, Zap } from "lucide-react";
import { useBestScore } from "../lib/bestScore";
import { BestScore, CornerFrame, ResultStat, StartButton, StatCard } from "./widgets";

const ROUND_SECONDS = 30;
const BALL_COUNT = 3;
const STAGES = [100, 75, 50, 25];
const STAGE_MS = 700;
const MAX_SIZE = 54;

let ballId = 0;

function spawnBall(width, height) {
  const margin = MAX_SIZE / 2 + 10;
  return {
    id: ++ballId,
    x: margin + Math.random() * Math.max(1, width - margin * 2),
    y: margin + Math.random() * Math.max(1, height - margin * 2),
    stage: 0,
    stageStartedAt: performance.now(),
  };
}

export default function SpeedGame() {
  const [phase, setPhase] = useState("idle");
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const ballsRef = useRef([]);
  const boardRef = useRef(null);
  const [, bump] = useReducer((value) => value + 1, 0);
  const { best, update, reset } = useBestScore("bestScore_speed");

  const boardSize = () => ({
    w: boardRef.current?.clientWidth || 600,
    h: boardRef.current?.clientHeight || 400,
  });

  const start = () => {
    const { w, h } = boardSize();
    ballsRef.current = Array.from({ length: BALL_COUNT }, () => spawnBall(w, h));
    setScore(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(ROUND_SECONDS);
    setPhase("playing");
    bump();
  };

  useEffect(() => {
    if (phase !== "playing") return undefined;
    const timer = window.setInterval(() => {
      const now = performance.now();
      const balls = ballsRef.current;
      let changed = false;
      for (let index = 0; index < balls.length; index += 1) {
        const ball = balls[index];
        if (now - ball.stageStartedAt < STAGE_MS) continue;
        if (ball.stage < STAGES.length - 1) {
          ball.stage += 1;
          ball.stageStartedAt = now;
          changed = true;
        } else {
          const { w, h } = boardSize();
          balls[index] = spawnBall(w, h);
          setScore((value) => value - 500);
          setMisses((value) => value + 1);
          changed = true;
        }
      }
      if (changed) bump();
    }, 80);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return undefined;
    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          setPhase("over");
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "over") update(score);
  }, [phase, score, update]);

  const hitBall = (id) => (event) => {
    event.stopPropagation();
    if (phase !== "playing") return;
    const balls = ballsRef.current;
    const index = balls.findIndex((ball) => ball.id === id);
    if (index === -1) return;
    const points = Math.round((STAGES[balls[index].stage] / 100) * 1000);
    setScore((value) => value + points);
    setHits((value) => value + 1);
    const { w, h } = boardSize();
    balls[index] = spawnBall(w, h);
    bump();
  };

  const accuracy =
    hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 100;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="TIME" value={`${timeLeft}s`} icon={Clock} highlight={phase === "playing"} />
        <StatCard label="SCORE" value={score} icon={Zap} />
        <StatCard label="ACCURACY" value={`${accuracy}%`} icon={Target} />
        <BestScore best={best} onReset={reset} />
      </div>
      <div
        ref={boardRef}
        className="relative w-full aspect-[16/10] bg-card border border-border rounded-lg shadow-md overflow-hidden cursor-crosshair select-none"
      >
        <CornerFrame />
        {phase === "idle" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
            <Target size={40} className="text-primary" />
            <p className="font-mono text-[11px] text-muted-foreground max-w-sm text-center leading-relaxed">
              3 balls shrink 100% → 0%. Click at full size for 1000 pts (scales
              down). A missed ball costs -500. 30 seconds.
            </p>
            <StartButton onClick={start} icon={Zap} />
          </div>
        ) : null}
        {phase === "playing"
          ? ballsRef.current.map((ball) => {
              const percent = STAGES[ball.stage];
              const size = Math.max(10, MAX_SIZE * (percent / 100));
              return (
                <button
                  key={ball.id}
                  onClick={hitBall(ball.id)}
                  style={{
                    left: ball.x - size / 2,
                    top: ball.y - size / 2,
                    width: size,
                    height: size,
                  }}
                  className="absolute rounded-full flex items-center justify-center bg-primary shadow-[0_0_18px_4px_hsl(var(--primary)/0.6)] ring-2 ring-primary-foreground/20"
                >
                  <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
                  <span className="absolute inset-[18%] rounded-full bg-primary-foreground/25" />
                  {size >= 30 ? (
                    <span className="relative font-mono text-[9px] text-primary-foreground font-bold drop-shadow">
                      {percent}
                    </span>
                  ) : (
                    <span className="relative w-2 h-2 rounded-full bg-primary-foreground shadow-[0_0_6px_hsl(var(--primary-foreground))]" />
                  )}
                </button>
              );
            })
          : null}
        {phase === "over" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
            <Target size={32} className="text-primary" />
            <p className="font-display font-black text-3xl uppercase text-foreground">
              {score} PTS
            </p>
            <div className="grid grid-cols-3 gap-3 mt-2 w-full max-w-md">
              <ResultStat label="HITS" value={hits} />
              <ResultStat label="MISSES" value={misses} />
              <ResultStat label="ACCURACY" value={`${accuracy}%`} />
            </div>
            <StartButton onClick={start} label="PLAY AGAIN" icon={RotateCcw} />
          </div>
        ) : null}
      </div>
      <p className="font-mono text-[10px] text-muted-foreground/60 text-center mt-3">
        100%=1000 · 75%=750 · 50%=500 · 25%=250 · miss=-500
      </p>
    </div>
  );
}
