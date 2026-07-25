// eslint-disable-next-line react/prop-types -- prop-types isn't used anywhere in this codebase
const SectionHeader = ({ number, eyebrow, headline, caption }) => {
  return (
    <div className="flex justify-between items-end mb-8">
      <div className="flex gap-4">
        {/* violet seam marker — echoes the hero's rails */}
        <span aria-hidden="true" className="mt-1 w-px self-stretch bg-[var(--accent)]/70" />
        <div>
          <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase">
            <span className="text-[var(--accent)] font-semibold">{number}</span>
            <span className="opacity-45">/ {eyebrow}</span>
          </div>
          <h2 className="mt-2 text-3xl md:text-5xl font-black leading-none tracking-[-0.03em] text-[var(--fg)] [font-family:aeonik]">
            {headline}
          </h2>
        </div>
      </div>
      {caption && (
        <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase opacity-55 text-[var(--fg)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          {caption}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
