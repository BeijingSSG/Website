import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Circle,
  Eraser,
  FolderOpen,
  Pencil,
  RotateCcw,
  Save,
  Square,
  Trash2,
} from "lucide-react";
import SectionFrame from "../components/SectionFrame";
import { Button, Input } from "../components/ui";
import { loadPlays, savePlays } from "../lib/storage";
import { useToast } from "../lib/toast";

const TOOLS = [
  { id: "draw", icon: Pencil, label: "DRAW" },
  { id: "arrow", icon: ArrowRight, label: "PATH" },
  { id: "rect", icon: Square, label: "ZONE" },
  { id: "circle", icon: Circle, label: "MARK" },
  { id: "erase", icon: Eraser, label: "ERASE" },
];

const COLORS = [
  { id: "orange", value: "#FF5F00", label: "HI-VIS" },
  { id: "blue", value: "#0066FF", label: "SIGNAL" },
  { id: "red", value: "#EF4444", label: "RED" },
  { id: "white", value: "#FFFFFF", label: "WHITE" },
  { id: "green", value: "#22C55E", label: "GREEN" },
];

function drawArrow(ctx, start, end, color, lineWidth) {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  const head = 12;
  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(
    end.x - head * Math.cos(angle - 0.4),
    end.y - head * Math.sin(angle - 0.4),
  );
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(
    end.x - head * Math.cos(angle + 0.4),
    end.y - head * Math.sin(angle + 0.4),
  );
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

export default function StrategyBoard({
  fieldImage = "/field.png",
  sectionId = "tactics",
  fieldLabel = "OVERRIDE FIELD // 12' × 12'",
  title = "STRATEGY BOARD",
  description = "Draw plays on the Override field. Plan autonomous routes, driver strategies, and pin placement.",
}) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const originRef = useRef(null);
  const strokeRef = useRef([]);
  const [tool, setTool] = useState("draw");
  const [color, setColor] = useState("#FF5F00");
  const lineWidth = 3;
  const [shapes, setShapes] = useState([]);
  const [playName, setPlayName] = useState("");
  const [plays, setPlays] = useState([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setPlays(loadPlays());
  }, []);

  const pointFromEvent = useCallback((event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    return {
      x: ((source.clientX - rect.left) / rect.width) * canvas.width,
      y: ((source.clientY - rect.top) / rect.height) * canvas.height,
    };
  }, []);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => {
      if (shape.type === "freehand") {
        ctx.beginPath();
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        shape.points.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      } else if (shape.type === "arrow") {
        drawArrow(ctx, shape.start, shape.end, shape.color, shape.lineWidth);
      } else if (shape.type === "rect") {
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.lineWidth;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(
          shape.start.x,
          shape.start.y,
          shape.end.x - shape.start.x,
          shape.end.y - shape.start.y,
        );
        ctx.setLineDash([]);
      } else if (shape.type === "circle") {
        const radius = Math.hypot(
          shape.end.x - shape.start.x,
          shape.end.y - shape.start.y,
        );
        ctx.beginPath();
        ctx.arc(shape.start.x, shape.start.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.lineWidth;
        ctx.stroke();
      }
    });
  }, [shapes]);

  useEffect(() => {
    paint();
  }, [paint]);

  const eraseAt = (point, includeShapes) => {
    setShapes((current) =>
      current.filter((shape) => {
        if (shape.type === "freehand") {
          return !shape.points.some(
            (p) => Math.hypot(p.x - point.x, p.y - point.y) < 20,
          );
        }
        if (!includeShapes) return true;
        if (shape.type === "arrow" || shape.type === "rect" || shape.type === "circle") {
          return (
            Math.hypot(shape.start.x - point.x, shape.start.y - point.y) > 20 &&
            Math.hypot(shape.end.x - point.x, shape.end.y - point.y) > 20
          );
        }
        return true;
      }),
    );
  };

  const onPointerDown = (event) => {
    event.preventDefault();
    const point = pointFromEvent(event);
    drawingRef.current = true;
    if (tool === "draw") strokeRef.current = [point];
    else if (tool === "erase") eraseAt(point, true);
    else originRef.current = point;
  };

  const onPointerMove = (event) => {
    event.preventDefault();
    if (!drawingRef.current) return;
    const point = pointFromEvent(event);
    if (tool === "draw") {
      const next = [...strokeRef.current, point];
      strokeRef.current = next;
      paint();
      const ctx = canvasRef.current.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      next.forEach((p, index) => {
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    } else if (tool === "erase") {
      eraseAt(point, false);
    } else if (originRef.current) {
      const origin = originRef.current;
      paint();
      const ctx = canvasRef.current.getContext("2d");
      if (tool === "arrow") drawArrow(ctx, origin, point, color, lineWidth);
      else if (tool === "rect") {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(origin.x, origin.y, point.x - origin.x, point.y - origin.y);
        ctx.setLineDash([]);
      } else if (tool === "circle") {
        const radius = Math.hypot(point.x - origin.x, point.y - origin.y);
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    }
  };

  const onPointerUp = (event) => {
    event.preventDefault();
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (tool === "draw" && strokeRef.current.length > 1) {
      const points = strokeRef.current;
      strokeRef.current = [];
      setShapes((current) => [
        ...current,
        { type: "freehand", points, color, lineWidth },
      ]);
      return;
    }
    if (
      (tool === "arrow" || tool === "rect" || tool === "circle") &&
      originRef.current
    ) {
      const origin = originRef.current;
      const point = event.changedTouches
        ? (() => {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const touch = event.changedTouches[0];
            return {
              x: ((touch.clientX - rect.left) / rect.width) * canvas.width,
              y: ((touch.clientY - rect.top) / rect.height) * canvas.height,
            };
          })()
        : pointFromEvent(event);
      originRef.current = null;
      setShapes((current) => [
        ...current,
        { type: tool, start: origin, end: point, color, lineWidth },
      ]);
    }
  };

  const clearBoard = () => {
    setShapes([]);
    strokeRef.current = [];
    originRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const savePlay = () => {
    if (!playName.trim()) {
      toast({
        title: "Name required",
        description: "Enter a play name before saving.",
      });
      return;
    }
    const created = {
      id: crypto.randomUUID(),
      name: playName.trim(),
      canvas_data: JSON.stringify(shapes),
    };
    const next = [created, ...plays];
    setPlays(next);
    savePlays(next);
    setPlayName("");
    toast({
      title: "Play saved",
      description: `"${created.name}" added to your library.`,
    });
  };

  const loadPlay = (play) => {
    setShapes(JSON.parse(play.canvas_data || "[]"));
    setLibraryOpen(false);
    toast({ title: "Play loaded", description: `Loaded "${play.name}"` });
  };

  const deletePlay = (id) => {
    const next = plays.filter((play) => play.id !== id);
    setPlays(next);
    savePlays(next);
    toast({ title: "Play deleted" });
  };

  return (
    <SectionFrame id={sectionId} label="TACTICS_SUITE_01" className="bg-background">
      <div className="max-w-7xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary mb-2">
            INTERACTIVE // STRATEGY
          </p>
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tight text-foreground">
            {title}
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-3 max-w-xl leading-relaxed">
            {description}
          </p>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-wrap lg:flex-nowrap lg:flex-col gap-2 lg:w-14 shrink-0 order-2 lg:order-1">
            {TOOLS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setTool(item.id)}
                  title={item.label}
                  className={`flex flex-col items-center justify-center p-2 border transition-all ${
                    tool === item.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-mono text-[7px] tracking-wider mt-1">
                    {item.label}
                  </span>
                </button>
              );
            })}
            <div className="border-t border-border lg:border-t lg:border-l-0 my-1" />
            {COLORS.map((item) => (
              <button
                key={item.id}
                onClick={() => setColor(item.value)}
                title={item.label}
                className={`flex-1 lg:flex-none lg:w-full flex items-center justify-center p-2 border transition-all ${
                  color === item.value ? "border-primary" : "border-border"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.value }}
                />
              </button>
            ))}
            <div className="border-t border-border my-1" />
            <button
              onClick={clearBoard}
              title="CLEAR"
              className="flex flex-col items-center justify-center p-2 border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-all"
            >
              <RotateCcw size={16} />
              <span className="font-mono text-[7px] tracking-wider mt-1">CLEAR</span>
            </button>
          </div>
          <div className="flex-1 relative order-1 lg:order-2">
            <div className="relative w-full aspect-square max-w-[700px] mx-auto border-2 border-border bg-card overflow-hidden">
              <img
                src={fieldImage}
                alt="Strategy field top-down view"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              />
              <canvas
                ref={canvasRef}
                width={700}
                height={700}
                className="absolute inset-0 w-full h-full touch-none"
                style={{ cursor: tool === "erase" ? "crosshair" : "default" }}
                onMouseDown={onPointerDown}
                onMouseMove={onPointerMove}
                onMouseUp={onPointerUp}
                onMouseLeave={onPointerUp}
                onTouchStart={onPointerDown}
                onTouchMove={onPointerMove}
                onTouchEnd={onPointerUp}
              />
              <div className="absolute top-2 left-2 font-mono text-[8px] text-muted-foreground/60 uppercase tracking-wider pointer-events-none">
                {fieldLabel}
              </div>
            </div>
          </div>
          <div className="lg:w-56 shrink-0 order-3">
            <div className="border border-border bg-card p-4">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
                PLAY LIBRARY
              </p>
              <Input
                placeholder="Play name..."
                value={playName}
                onChange={(event) => setPlayName(event.target.value)}
                className="font-mono text-xs h-8 mb-2 bg-background"
              />
              <Button
                onClick={savePlay}
                size="sm"
                className="w-full font-mono text-[10px] tracking-wider h-8"
              >
                <Save size={12} className="mr-1" /> SAVE PLAY
              </Button>
              <div className="mt-4 border-t border-border pt-3">
                <button
                  onClick={() => setLibraryOpen((open) => !open)}
                  className="flex items-center gap-1 font-mono text-[9px] uppercase text-muted-foreground hover:text-primary transition-colors mb-2"
                >
                  <FolderOpen size={12} /> SAVED ({plays.length})
                </button>
                {libraryOpen ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {plays.length === 0 ? (
                      <p className="font-mono text-[10px] text-muted-foreground/60">
                        No saved plays yet.
                      </p>
                    ) : null}
                    {plays.map((play) => (
                      <div
                        key={play.id}
                        className="flex items-center justify-between p-2 border border-border hover:border-primary/30 transition-colors"
                      >
                        <button
                          onClick={() => loadPlay(play)}
                          className="font-mono text-[10px] text-foreground hover:text-primary truncate text-left flex-1"
                        >
                          {play.name}
                        </button>
                        <button
                          onClick={() => deletePlay(play.id)}
                          className="text-muted-foreground hover:text-destructive ml-2 shrink-0"
                          aria-label={`Delete ${play.name}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
