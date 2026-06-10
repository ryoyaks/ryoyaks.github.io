export const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];



export const iconsList = [
  // Tools (用於 TechStack 跑馬燈)
  { name: "blender", image: "/images/icon/blender.webp" },
  { name: "photoshop", image: "/images/icon/photoshop.webp" },
  { name: "illustrator", image: "/images/icon/illustrator.webp" },
  { name: "clipstudiopaint", image: "/images/icon/clipstudiopaint.webp" },
  { name: "unity", image: "/images/icon/unity.webp" },
  { name: "unreal", image: "/images/icon/unreal.webp" },
  { name: "figma", image: "/images/icon/figma.webp" },
  
  // 對應 linkList 的社交與連結圖示
  { name: "melonbooks", image: "/images/icon/melonbooks.webp" },
  { name: "myacg", image: "/images/icon/myacg.webp" },
  { name: "hexbunnydoujin", image: "/images/icon/hexbunnydoujin.webp" },
  { name: "twitter", image: "/images/icon/twitter.webp" },
  { name: "facebook", image: "/images/icon/facebook.webp" },
  { name: "pixiv", image: "/images/icon/pixiv.webp" },
  { name: "fanbox", image: "/images/icon/fanbox.webp" },
  { name: "youtube", image: "/images/icon/youtube.webp" },
  { name: "twitch", image: "/images/icon/twitch.webp" },
  { name: "marshmallow", image: "/images/icon/marshmallow.webp" },
  { name: "paypal", image: "/images/icon/paypal.webp" },
  { name: "email", image: "/images/icon/email.webp" },
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
      { name: "melonbooks", displayName: "Melonbooks", subLabel: "りょりょや", href: "https://www.melonbooks.co.jp/circle/index.php?circle_id=135082", icon: iconMap.melonbooks },
      { name: "myacg", displayName: "買動漫", subLabel: "六六六亞", href: "https://www.myacg.com.tw/seller_market.php?seller=524453", icon: iconMap.myacg },
      { name: "hexbunnydoujin", displayName: "黑市兔", subLabel: "doujin", href: "https://hexbunnydoujin.tw/?search=author&id=RyoyakS", icon: iconMap.hexbunnydoujin },
      { name: "twitter", displayName: "Twitter (X)", subLabel: "@RyoyakS", href: "https://x.com/RyoyakS", icon: iconMap.twitter },
      { name: "facebook", displayName: "Facebook", subLabel: "RyoyakS2nd", href: "https://www.facebook.com/RyoyakS2nd/", icon: iconMap.facebook },
      { name: "pixiv", displayName: "Pixiv", subLabel: "15708685", href: "https://www.pixiv.net/users/15708685", icon: iconMap.pixiv },
      { name: "fanbox", displayName: "Fanbox", subLabel: "@ryoyaks", href: "https://www.fanbox.cc/@ryoyaks", icon: iconMap.fanbox },
      { name: "youtube", displayName: "YouTube", subLabel: "@RyoyakS", href: "https://www.youtube.com/@RyoyakS", icon: iconMap.youtube },
      { name: "twitch", displayName: "Twitch", subLabel: "streams", href: "https://www.fanbox.cc/@ryoyaks", icon: iconMap.twitch },
      { name: "marshmallow", displayName: "Marshmallow", subLabel: "留言給我", href: "https://www.fanbox.cc/@ryoyaks", icon: iconMap.marshmallow },
      { name: "paypal", displayName: "PayPal", subLabel: "買杯咖啡", href: "https://www.fanbox.cc/@ryoyaks", icon: iconMap.paypal },
      { name: "email", displayName: "Email", subLabel: "委託 / 聯絡", href: "mailto:ryoyaillust892763@gmail.com", icon: iconMap.email },
    ],
  },
];

// 4. 專案投影片資料
export const slides = [
  { id: 1, title: "iBlog", img: "/images/p1.webp" },
  { id: 2, title: "E-commerce Website", img: "/images/p2.webp" },
  { id: 3, title: "Daraz Clone", img: "/images/p3.webp" },
  { id: 4, title: "Quiz App", img: "/images/p4.webp" },
  { id: 5, title: "Text Editor", img: "/images/p5.webp" },
  { id: 6, title: "Code Editor", img: "/images/p6.webp" },
  { id: 7, title: "Python Compiler", img: "/images/p7.webp" },
];