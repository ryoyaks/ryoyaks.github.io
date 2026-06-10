import LinkIcon from "../components/LinkIcon";
import SectionHeader from "../components/SectionHeader";
import { linkList } from "../constants";

const Linktree = () => {
  const links = linkList[0].links;

  return (
    <section id="links" className="relative md:p-0 px-5 py-20 md:py-32 text-[var(--fg)]">
      <div className="container mx-auto">
        <SectionHeader
          number="01"
          eyebrow="Links"
          headline="All my online presence"
          caption={`${links.length} destinations`}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="block col-span-2 active:scale-[0.98] transition-transform"
            >
              <LinkIcon icon={item} type="wide" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Linktree;