import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "ABOUT", id: "about" },
  { label: "INTEL", id: "intel" },
  { label: "TACTICS", id: "tactics" },
  { label: "ROSTER", id: "roster" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollTo = (event, id) => {
    event.preventDefault();
    setOpen(false);
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate("/");
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 350);
  };

  const goHome = (event) => {
    event.preventDefault();
    setOpen(false);
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate("/");
  };

  const linkClass =
    "font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors cursor-pointer";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-16 h-14">
        <a href="#hero" onClick={goHome} className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="SuperSonic"
            className="h-12 w-auto object-contain"
          />
          <span className="font-display font-black text-sm tracking-[0.15em] uppercase text-foreground">
            SUPERSONIC
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(event) => scrollTo(event, link.id)}
              className={linkClass}
            >
              {link.label}
            </a>
          ))}
          <Link to="/training" className={linkClass}>
            TRAINING
          </Link>
        </div>
        <button
          onClick={() => setOpen((value) => !value)}
          className="md:hidden text-foreground"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open ? (
        <div className="md:hidden bg-background border-t border-border">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(event) => scrollTo(event, link.id)}
              className="block px-4 py-3 font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary border-b border-border/50 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/training"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary border-b border-border/50 transition-colors"
          >
            TRAINING
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
