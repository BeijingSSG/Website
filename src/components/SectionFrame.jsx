export default function SectionFrame({
  id,
  label,
  children,
  className = "",
}) {
  return (
    <section id={id} className={`relative px-4 md:px-8 lg:px-16 py-16 ${className}`}>
      <div className="absolute top-4 left-4 md:left-8 lg:left-16 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
        <span className="inline-block w-3 h-3 border-l-2 border-t-2 border-primary" />
        <span>SECTION_ID: {label}</span>
      </div>
      <div className="absolute bottom-4 right-4 md:right-8 lg:right-16">
        <span className="inline-block w-3 h-3 border-r-2 border-b-2 border-primary" />
      </div>
      {children}
    </section>
  );
}
