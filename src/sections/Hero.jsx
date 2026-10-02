import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero({
  programLabel = "VEX V5 ROBOTICS COMPETITION // 2026–2027",
  tagline = "BUILT FOR CHAMPIONS",
  scrollTarget = "#intel",
}) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-muted"
    >
      <img
        src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/logo.png"
            alt="SuperSonic logo"
            className="w-[20rem] h-[20rem] md:w-[28rem] md:h-[28rem] object-contain mx-auto"
          />
          <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-foreground/80 mt-6 [text-shadow:0_1px_6px_hsl(var(--background)),0_0_12px_hsl(var(--background))]">
            {programLabel}
          </p>
          <h1 className="font-display font-black text-3xl md:text-5xl uppercase tracking-[0.25em] text-foreground mt-3">
            {tagline}
          </h1>
        </motion.div>
      </div>
      <a
        href={scrollTarget}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronDown size={24} />
      </a>
    </section>
  );
}
