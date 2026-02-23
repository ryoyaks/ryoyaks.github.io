import { iconsList } from "../constants";
import LinkIcon from "./LinkIcon";

const Footer = () => {
  return (
    <div className="w-full flex-center flex-col md:gap-10 gap-7 bg-black-300 py-10">
      <div>
        <img
          src="/images/logo.png"
          alt="logo"
          className="w-7 h-7 object-cover object-center"
        />
      </div>
      {/* className="md:size-10 size-8" */}
      <div className="flex items-center md:gap-16 gap-8">
        {/* SELECT ONLY contact info IN  iconsList*/}
              {[
                 "twitter", "facebook","email"
              ].map((iconName, index) => {
                const icon = iconsList.find(i => i.name === iconName);
                return icon ? <LinkIcon key={index} icon={icon} type="small" /> : null;
              })}
      </div>
      <p className="font-regular md:text-lg text-sm">
        2026 © All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
