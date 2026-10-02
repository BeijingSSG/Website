import { useEffect, useState } from "react";
import { Crosshair, Shield, Zap } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import SpeedGame from "../training/SpeedGame";
import PrecisionGame from "../training/PrecisionGame";
import PressureGame from "../training/PressureGame";

const DRILLS = [
  { id: "speed", label: "SPEED & AGILITY", icon: Zap },
  { id: "precision", label: "PRECISION CONTROL", icon: Crosshair },
  { id: "pressure", label: "PRESSURE MAINTAINING", icon: Shield },
];

export default function Training() {
  const [drill, setDrill] = useState("speed");

  useEffect(() => {
    document.title = "Driver Training | SuperSonicCenter";
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <Nav />
      <div className="relative z-10 pt-24 pb-20 px-4 md:px-8 lg:px-16 max-w-4xl mx-auto">
        <div className="relative z-10">
          <div className="mb-8">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary mb-2">
              TRAINING // DRIVER DRILLS
            </p>
            <h1 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tight text-foreground flex items-center gap-3">
              <Crosshair size={36} className="text-primary" />
              DRIVER TRAINING CENTER
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-3 max-w-lg leading-relaxed">
              Three mini-games to train reaction speed, aim precision, and
              pressure management. Pick a drill and play.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
            {DRILLS.map((item) => {
              const Icon = item.icon;
              const active = drill === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setDrill(item.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-md border transition-all ${
                    active
                      ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/30"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-secondary-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-mono text-[8px] sm:text-[9px] tracking-wider text-center leading-tight">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
          {drill === "speed" ? <SpeedGame /> : null}
          {drill === "precision" ? <PrecisionGame /> : null}
          {drill === "pressure" ? <PressureGame /> : null}
        </div>
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
