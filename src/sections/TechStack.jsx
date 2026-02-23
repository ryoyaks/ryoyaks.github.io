import LinkIcon from "../components/LinkIcon";
import TitleHeader from "../components/TitleHeader";
import { iconsList } from "../constants";

const TechStack = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full md:my-40 my-20">
        <div className="container mx-auto md:p-0 px-5">
          <TitleHeader
            title="Tools"
            number="03"
            text="Tools I Use For Creation"
          />
        </div>
        <div className="md:mt-20 mt-10 relative">
          <div className="tech-stack-gradient-left-box w-36 h-full absolute bottom-0 left-0 z-20"></div>
          <div className="tech-stack-gradient-right-box w-36 h-full absolute bottom-0 right-0 z-20"></div>
          <div className="marquee h-52">
            <div className="marquee-box md:gap-12 gap-5">
              {/* SELECT ONLY TOOLS IN  iconsList*/}
              {[
                "blender", "photoshop", "illustrator", "clipstudiopaint", "unity", "unreal", "figma"
              ].map((iconName, index) => {
                const icon = iconsList.find(i => i.name === iconName);
                return icon ? <LinkIcon key={index} icon={icon} /> : null;
              })}
              {[
                "blender", "photoshop", "illustrator", "clipstudiopaint", "unity", "unreal", "figma"
              ].map((iconName, index) => {
                const icon = iconsList.find(i => i.name === iconName);
                return icon ? <LinkIcon key={index} icon={icon} /> : null;
              })}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;
