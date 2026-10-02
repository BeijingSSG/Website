import { useEffect, useReducer, useRef, useState } from "react";
import { Clock, Heart, RotateCcw, Shield, Triangle, Zap } from "lucide-react";
import { useBestScore } from "../lib/bestScore";
import { BestScore, CornerFrame, PressureStat, ResultStat, StartButton } from "./widgets";

const LIVES = 3;
const PLAYER = 17;
const HAZARD = 16;
const MOVE_SPEED = 360;
const POINTS_PER_SECOND = 150;

let hazardId = 0;

function spawnHazard(width) {
  return {
    id: ++hazardId,
    x: HAZARD + Math.random() * Math.max(1, width - HAZARD * 2),
    y: -HAZARD,
    vy: 225 + Math.random() * 120,
    rot: Math.random() * 360,
  };
}

export default function PressureGame() {
  const [phase, setPhase] = useState("idle");
  const [lives, setLives] = useState(LIVES);
  const [score, setScore] = useState(0);
  const hazards = useRef([]);
  const playerX = useRef(null);
  const keys = useRef({ left: false, right: false });
  const pointer = useRef(false);
  const lastSpawn = useRef(0);
  const elapsed = useRef(0);
  const scoreValue = useRef(0);
  const livesValue = useRef(LIVES);
  const invuln = useRef(0);
  const lastFrame = useRef(0);
  const frame = useRef(null);
  const boardRef = useRef(null);
  const [, bump] = useReducer((value) => value + 1, 0);
  const { best, update, reset } = useBestScore("bestScore_pressure");

  const start = () => {
    const width = boardRef.current?.clientWidth || 600;
    hazards.current = [];
    playerX.current = width / 2;
    keys.current = { left: false, right: false };
    pointer.current = false;
    lastSpawn.current = performance.now();
    elapsed.current = 0;
    scoreValue.current = 0;
    livesValue.current = LIVES;
    invuln.current = 0;
    lastFrame.current = performance.now();
    setLives(LIVES);
    setScore(0);
    setPhase("playing");
  };

  useEffect(() => {
    if (phase !== "playing") return undefined;
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (key === "arrowleft" || key === "a") keys.current.left = true;
      if (key === "arrowright" || key === "d") keys.current.right = true;
    };
    const onKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (key === "arrowleft" || key === "a") keys.current.left = false;
      if (key === "arrowright" || key === "d") keys.current.right = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    lastFrame.current = performance.now();

    const tick = (now) => {
      const dt = Math.min(60, now - lastFrame.current);
      lastFrame.current = now;
      elapsed.current += dt;
      const board = boardRef.current;
      const width = board?.clientWidth || 600;
      const height = board?.clientHeight || 400;

      if (!pointer.current) {
        let delta = 0;
        if (keys.current.left) delta -= MOVE_SPEED * (dt / 1000);
        if (keys.current.right) delta += MOVE_SPEED * (dt / 1000);
        playerX.current = Math.max(
          PLAYER,
          Math.min(width - PLAYER, (playerX.current || width / 2) + delta),
        );
      }

      const interval = Math.max(190, 680 - elapsed.current / 12);
      if (now - lastSpawn.current >= interval) {
        hazards.current.push(spawnHazard(width));
        lastSpawn.current = now;
      }

      const fallScale = 1 + elapsed.current / 11000;
      const playerY = height - PLAYER - 14;
      const kept = [];
      let hit = false;
      for (const hazard of hazards.current) {
        hazard.y += hazard.vy * fallScale * (dt / 1000);
        hazard.rot += 90 * (dt / 1000);
        if (hazard.y - HAZARD > height) continue;
        if (invuln.current <= 0) {
          const dx = hazard.x - (playerX.current || width / 2);
          const dy = hazard.y - playerY;
          if (dx * dx + dy * dy <= (PLAYER + HAZARD - 4) ** 2) {
            hit = true;
            continue;
          }
        }
        kept.push(hazard);
      }
      hazards.current = kept;
      if (hit) {
        livesValue.current -= 1;
        invuln.current = 1200;
        setLives(livesValue.current);
        if (livesValue.current <= 0) {
          scoreValue.current = Math.round(scoreValue.current);
          setScore(scoreValue.current);
          setPhase("over");
          return;
        }
      }
      if (invuln.current > 0) invuln.current -= dt;
      scoreValue.current += POINTS_PER_SECOND * (dt / 1000);
      setScore(Math.round(scoreValue.current));
      bump();
      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "over") update(score);
  }, [phase, score, update]);

  const trackPointer = (event) => {
    if (phase !== "playing") return;
    const rect = boardRef.current.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    const x = source.clientX - rect.left;
    playerX.current = Math.max(PLAYER, Math.min((rect.width || 600) - PLAYER, x));
    pointer.current = true;
  };

  const survived = Math.floor(elapsed.current / 1000);
  const blinking = invuln.current > 0;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <PressureStat
          label="TIME"
          value={`${survived}s`}
          icon={Clock}
          highlight={phase === "playing"}
        />
        <PressureStat label="SCORE" value={score} icon={Zap} />
        <div className="border border-border bg-background p-3 flex items-center gap-3">
          <Heart size={16} className="text-destructive" />
          <div>
            <div className="flex gap-1 leading-none">
              {Array.from({ length: LIVES }).map((_, index) => (
                <Heart
                  key={index}
                  size={16}
                  className={
                    index < lives
                      ? "text-destructive fill-destructive"
                      : "text-muted-foreground/30"
                  }
                />
              ))}
            </div>
            <div className="font-mono text-[8px] tracking-[0.15em] text-muted-foreground uppercase mt-1">
              LIVES
            </div>
          </div>
        </div>
        <BestScore best={best} onReset={reset} />
      </div>
      <div
        ref={boardRef}
        onMouseMove={trackPointer}
        onMouseLeave={() => {
          pointer.current = false;
        }}
        onTouchStart={trackPointer}
        onTouchMove={trackPointer}
        onTouchEnd={() => {
          pointer.current = false;
        }}
        className="relative w-full aspect-[16/10] bg-card border border-border rounded-lg shadow-md overflow-hidden select-none touch-none"
        style={{ cursor: phase === "playing" ? "none" : "default" }}
      >
        <CornerFrame />
        <div className="absolute left-0 right-0 bottom-7 h-px bg-primary/40 shadow-[0_0_6px_hsl(var(--primary)/0.5)]" />
        {phase === "idle" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
            <Triangle size={40} className="text-destructive/40" />
            <p className="font-mono text-[11px] text-muted-foreground max-w-sm text-center leading-relaxed">
              Move your blue circle left/right (arrows, A/D, or drag) and dodge
              the falling triangles. 3 lives. Earn 150 pts per second survived.
            </p>
            <StartButton onClick={start} icon={Shield} />
          </div>
        ) : null}
        {phase === "playing" ? (
          <>
            {hazards.current.map((hazard) => (
              <div
                key={hazard.id}
                style={{
                  left: hazard.x - HAZARD,
                  top: hazard.y - HAZARD,
                  width: HAZARD * 2,
                  height: HAZARD * 2,
                  transform: `rotate(${hazard.rot}deg)`,
                }}
                className="absolute flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 40 40"
                  className="w-full h-full"
                  style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary)/0.85))" }}
                >
                  <polygon
                    points="20,4 37,35 3,35"
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--primary-foreground))"
                    strokeOpacity="0.35"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ))}
            {playerX.current != null ? (
              <div
                style={{
                  left: playerX.current - PLAYER,
                  top: `calc(100% - ${PLAYER + 14}px)`,
                  width: PLAYER * 2,
                  height: PLAYER * 2,
                  opacity: blinking ? 0.45 : 1,
                }}
                className="absolute rounded-full bg-emerald-400 shadow-[0_0_20px_5px_rgba(52,211,153,0.6)] border-2 border-emerald-100/40 flex items-center justify-center"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              </div>
            ) : null}
          </>
        ) : null}
        {phase === "over" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
            <Shield size={32} className="text-destructive" />
            <p className="font-display font-black text-3xl uppercase text-foreground">
              {score} PTS
            </p>
            <div className="grid grid-cols-2 gap-3 mt-2 w-full max-w-sm">
              <ResultStat label="SURVIVED" value={`${survived}s`} />
              <ResultStat label="BEST" value={best} />
            </div>
            <StartButton onClick={start} label="PLAY AGAIN" icon={RotateCcw} />
          </div>
        ) : null}
      </div>
      <p className="font-mono text-[10px] text-muted-foreground/60 text-center mt-3">
        ←/→ or A/D to move · dodge triangles · 150 pts/sec · 3 lives
      </p>
    </div>
  );
}
