const SectionHeader = ({ number, eyebrow, headline, caption }) => {
  return (
    <div className="flex justify-between items-end mb-7">
      <div>
        <div className="text-[11px] tracking-[0.2em] opacity-60 uppercase">
          {number} / {eyebrow}
        </div>
        <h2 className="text-3xl md:text-5xl font-black mt-1 leading-none text-[var(--fg)]">
          {headline}
        </h2>
      </div>
      {caption && (
        <div className="text-xs opacity-50 text-[var(--fg)]">{caption}</div>
      )}
    </div>
  );
};

export default SectionHeader;
