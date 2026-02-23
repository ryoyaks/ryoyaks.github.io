import TitleHeader from "../components/TitleHeader";
import LinkIcon from "../components/LinkIcon";
import { linkList } from "../constants"; 

const Linktree = () => {

  // 將陣列轉成以 name 為 key 的物件，方便直接 index 存取
  const links = linkList[0].links.reduce((acc, link) => {
    acc[link.name] = link;
    return acc;
  }, {});
  
  // LINKS start (這裡改為標準 JS 註解)
  return (
    <>  
    <section id="linktree" className="flex-center relative md:p-0 px-5">
    <div className="container w-full h-full md:my-40 my-20 relative z-5">
        <TitleHeader
          title="Links"
          number="01"
          text="ALL MY ONLINE PRESENCE IN ONE PLACE"
        />

        {/* add a space between title and the grid */}
        <div className="h-10"></div>
        <div className="md:col-span-6 col-span-12 row-span-4">
            {/* Grid 容器 */}
            <div className="grid grid-cols-2 
                            sm:grid-cols-3 
                            md:grid-cols-3 
                            lg:grid-cols-6 
                            gap-4 
                            flex-grow content-start">
            {[
                "twitter", "facebook", "pixiv", "youtube", "twitch", 
                "fanbox",  "myacg", "melonbooks","hexbunnydoujin","email","marshmallow", "paypal"
            ].map((key) => {
                const item = links[key];
                if (!item) return null;

                // 判斷 Case
                let type = "wide"; 
                let colSpan = "col-span-2";

                return (
                <a 
                    key={key} 
                    href={item.href} 
                    target="_blank" 
                    rel="noreferrer"
                    // 動態切換 col-span，確保長方形能佔兩格
                    className={`block active:scale-95 transition-transform ${colSpan}`}
                >
                    <LinkIcon icon={item} type={type} />
                </a>
                );
            })}
           
            

            </div>
            
        </div>

        
        
    </div>
    </section>
    
    </>
  );
}

export default Linktree;