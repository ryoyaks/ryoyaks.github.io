import React from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';

const TwitterFeed = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-[500px] h-[600px] overflow-hidden rounded-xl border border-white/10">
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="RyoyakS" // 你的推特帳號
        options={{ height: 600 }}
        theme="dark" // 與你的黑底網站相配
        transparent
        noBorders
        noScrollbar
      />
    </div>
  );
};

export default TwitterFeed;