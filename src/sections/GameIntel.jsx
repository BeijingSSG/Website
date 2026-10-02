import { motion } from "framer-motion";
import { Layers, MapPin, Target, ToggleRight } from "lucide-react";
import SectionFrame from "../components/SectionFrame";

const SCORES = [
  {
    points: "5 PTS",
    desc: "Each Alliance-colored Pin scored in any Goal",
    icon: MapPin,
  },
  {
    points: "10 PTS",
    desc: "Each yellow Pin in a Goal when your Alliance owns that Quadrant's Toggle",
    icon: ToggleRight,
  },
  {
    points: "8 PTS",
    desc: "Each Robot fully within the Midfield zone at match end",
    icon: Target,
  },
  {
    points: "12 PTS",
    desc: "Autonomous Bonus awarded to the Alliance that scores more points during Autonomous",
    icon: Layers,
  },
];

const BRIEFINGS = [
  {
    title: "CUPS & PINS",
    content:
      "56 Cups and 63 Pins start on the field. Alliance-colored Pins (red/blue) are worth 5 pts each when scored in any Goal. Yellow Pins are worth 10 pts — but only to the Alliance that currently owns the Toggle in that Quadrant. Cups sit on top of Pins on Goals and do not score points on their own.",
  },
  {
    title: "GOALS",
    content:
      "9 Goals total: 4 neutral Short Goals, 1 neutral Tall Goal (center), 2 Red Alliance Goals, and 2 Blue Alliance Goals. Score Pins by stacking them onto Goals. Cups placed on top of a stack do not add points — but they protect the stack from being knocked off.",
  },
  {
    title: "TOGGLES & QUADRANTS",
    content:
      "4 Toggles, one on each field wall, divide the field into 4 Quadrants. Setting a Toggle to your color means your Alliance earns 10 pts per yellow Pin scored in Goals within that Quadrant. Both Alliances can flip Toggles back and forth throughout the match.",
  },
  {
    title: "MATCH FORMAT",
    content:
      "15-second Autonomous Period, then 1:45 Driver Controlled. Two Alliances of two Teams each. The Autonomous Bonus (12 pts) goes to whichever Alliance scores more in Auto. Both Alliances can independently earn an Autonomous Win Point. 4 Loaders on the field perimeter let drivers feed Pins/Cups to their robot.",
  },
];

export default function GameIntel() {
  return (
    <SectionFrame id="intel" label="GAME_INTEL_01" className="bg-background">
      <div className="max-w-6xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary mb-2">
            CLASSIFIED // GAME DATA
          </p>
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tight text-foreground">
            GAME INTEL
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-3 max-w-xl leading-relaxed">
            VEX Override pits two alliances in a high-stakes battle for field
            control. Master the scoring matrix. Own the Toggles. Dominate the
            Midfield.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-4 gap-4 mt-12">
          {SCORES.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.points}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="border border-border bg-card p-5 relative group hover:border-primary/40 transition-colors"
              >
                <Icon size={16} className="text-primary mb-3" />
                <div className="font-display font-black text-2xl text-foreground">
                  {item.points}
                </div>
                <p className="font-mono text-[11px] text-muted-foreground mt-2 leading-relaxed">
                  {item.desc}
                </p>
                <span className="absolute top-2 right-2 font-mono text-[8px] text-muted-foreground/50">
                  0{index + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {BRIEFINGS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="border border-border bg-card p-6 relative"
            >
              <div className="absolute top-3 left-3 w-2 h-2 border-l border-t border-primary" />
              <div className="absolute bottom-3 right-3 w-2 h-2 border-r border-b border-primary" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wide text-foreground">
                {item.title}
              </h3>
              <p className="font-mono text-[11px] text-muted-foreground mt-3 leading-relaxed">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
