import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="relative bg-background px-4 md:px-8 lg:px-16 py-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-10">
          About Our Team
        </h2>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              SuperSonic is a competitive robotics team built around the VEX V5
              Robotics Competition. Students design, build, program, and drive
              real robots — learning mechanical design, coding, strategy, and
              teamwork through every build season.
            </p>
            <p>
              VEX is the world's largest school robotics program, challenging
              thousands of teams worldwide to solve a brand-new game each year
              with a robot of their own design — fostering creativity, problem
              solving, and a lasting passion for STEM.
            </p>
            <a
              href="https://www.vexrobotics.com/v5/competition/vrc-current-game"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-primary hover:text-primary/80 transition-colors"
            >
              Learn More <ArrowRight size={14} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80"
              alt="Robot"
              className="w-full h-48 md:h-56 object-cover rounded-lg border border-border"
            />
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
              alt="Team"
              className="w-full h-48 md:h-56 object-cover rounded-lg border border-border"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
