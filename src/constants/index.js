export const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];



export const iconsList = [
  // Tools (用於 TechStack 跑馬燈)
  { name: "blender", image: "/images/icon/blender.png" },
  { name: "photoshop", image: "/images/icon/photoshop.png" },
  { name: "illustrator", image: "/images/icon/illustrator.png" },
  { name: "clipstudiopaint", image: "/images/icon/clipstudiopaint.png" },
  { name: "unity", image: "/images/icon/unity.png" },
  { name: "unreal", image: "/images/icon/unreal.png" },
  { name: "figma", image: "/images/icon/figma.png" },
  
  // 對應 linkList 的社交與連結圖示
  { name: "melonbooks", image: "/images/icon/melonbooks.png" },
  { name: "myacg", image: "/images/icon/myacg.png" },
  { name: "hexbunnydoujin", image: "/images/icon/hexbunnydoujin.png" },
  { name: "twitter", image: "/images/icon/twitter.png" },
  { name: "facebook", image: "/images/icon/facebook.png" },
  { name: "pixiv", image: "/images/icon/pixiv.png" },
  { name: "fanbox", image: "/images/icon/fanbox.png" },
  { name: "youtube", image: "/images/icon/youtube.png" },
  { name: "twitch", image: "/images/icon/twitch.png" },
  { name: "marshmallow", image: "/images/icon/marshmallow.png" },
  { name: "paypal", image: "/images/icon/paypal.png" },
  { name: "email", image: "/images/icon/email.png" },
];

// 建立一個路徑查找表，讓 linkList 可以用名字直接抓圖
const iconMap = iconsList.reduce((acc, icon) => {
  acc[icon.name] = icon.image;
  return acc;
}, {});

// src/constants/index.js

export const linkList = [
  {
    links: [
      { 
        name: "melonbooks", // 查找用的 Key (小寫、簡單)
        displayName: "Melonbooks | りょりょや", // 實際顯示的文字
        href: "https://www.melonbooks.co.jp/circle/index.php?circle_id=135082", 
        icon: iconMap.melonbooks 
      },{ 
        name: "myacg", // 查找用的 Key (小寫、簡單)
        displayName: "買動漫 | 六六六亞", // 實際顯示的文字
        href: "https://www.myacg.com.tw/seller_market.php?seller=524453", 
        icon: iconMap.myacg 
      },{ 
        name: "hexbunnydoujin", // 查找用的 Key (小寫、簡單)
        displayName: "黑市兔", // 實際顯示的文字
        href: "https://hexbunnydoujin.tw/?search=author&id=RyoyakS", 
        icon: iconMap.hexbunnydoujin 
      },
      { 
        name: "twitter", 
        displayName: "Twitter (X)", 
        href: "https://x.com/RyoyakS", 
        icon: iconMap.twitter 
      },
      { 
        name: "facebook", 
        displayName: "Facebook", 
        href: "https://www.facebook.com/RyoyakS2nd/", 
        icon: iconMap.facebook 
      },{ 
        name: "pixiv", 
        displayName: "Pixiv", 
        href: "https://www.pixiv.net/users/15708685", 
        icon: iconMap.pixiv 
      },
      { 
        name: "fanbox", 
        displayName: "Fanbox", 
        href: "https://www.fanbox.cc/@ryoyaks", 
        icon: iconMap.fanbox 
      },
      { 
        name: "youtube", 
        displayName: "YouTube", 
        href: "https://www.youtube.com/@RyoyakS", 
        icon: iconMap.youtube 
      },
      { 
        name: "twitch", 
        displayName: "Twitch", 
        href: "https://www.fanbox.cc/@ryoyaks", 
        icon: iconMap.twitch 
      },
      { 
        name: "marshmallow", 
        displayName: "Marshmallow | 留言給我", 
        href: "https://www.fanbox.cc/@ryoyaks", 
        icon: iconMap.marshmallow 
      },
      { 
        name: "paypal", 
        displayName: "Paypal | 買杯咖啡給我", 
        href: "https://www.fanbox.cc/@ryoyaks", 
        icon: iconMap.paypal 
      },
      { 
        name: "email", 
        displayName: "Email | 委託/聯絡我", 
        href: "mailto:ryoyaillust892763@gmail.com", 
        icon: iconMap.email}
    ],
  },
];

// 4. 專案投影片資料
export const slides = [
  { id: 1, title: "iBlog", img: "/images/p1.png" },
  { id: 2, title: "E-commerce Website", img: "/images/p2.png" },
  { id: 3, title: "Daraz Clone", img: "/images/p3.png" },
  { id: 4, title: "Quiz App", img: "/images/p4.png" },
  { id: 5, title: "Text Editor", img: "/images/p5.png" },
  { id: 6, title: "Code Editor", img: "/images/p6.png" },
  { id: 7, title: "Python Compiler", img: "/images/p7.png" },
];