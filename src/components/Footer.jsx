const NAV = [
  { label: "Game Intel", href: "#intel" },
  { label: "Strategy Board", href: "#tactics" },
  { label: "Team Roster", href: "#roster" },
];

const RESOURCES = [
  {
    label: "Official Game Page",
    href: "https://www.vexrobotics.com/v5/competition/vrc-current-game",
  },
  {
    label: "Game Manual PDF",
    href: "https://link.vex.com/docs/26-27/v5rc/game-manual",
  },
  { label: "Find Events", href: "https://events.vex.com" },
  { label: "VEX Forum", href: "https://www.vexforum.com" },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border px-4 md:px-8 lg:px-16 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/logo.png"
                alt="SuperSonic logo"
                className="h-10 w-auto object-contain"
              />
              <span className="font-display font-black text-sm tracking-[0.15em] uppercase text-foreground">
                SUPERSONIC
              </span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground leading-relaxed max-w-sm">
              Built for Champions.
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                NAVIGATE
              </p>
              <div className="space-y-1.5">
                {NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                RESOURCES
              </p>
              <div className="space-y-1.5">
                {RESOURCES.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[9px] text-muted-foreground/60">
            © {new Date().getFullYear()} // SUPERSONIC COMMAND CENTER
          </p>
          <p className="font-mono text-[9px] text-muted-foreground/40">
            SYS_STATUS: OPERATIONAL
          </p>
        </div>
      </div>
    </footer>
  );
}
