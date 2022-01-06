import React from 'react';

const Footer: React.FC = () => {
  return <div className="flex bg-black justify-center py-10 background-color-tint-black">
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-2 gap-6 px-10">
        <a href="https://twitter.com/gorillaglxy" target="_blank" className="inline-flex text-center justify-center items-center">
          <img src={'/images/icon_twitter.png'} />
        </a>
        <a href="https://discord.gg/GZpTs7pG27" target="_blank" className="inline-flex text-center justify-center items-center">
          <img src={'/images/icon_discord.png'} />
        </a>
      </div>

      <a href="https://nftcalendar.io/event/gorilla-galaxy-genesis/" target="_blank">
        <div className="flex flex-row space-x-2 justify-center items-center">
          <p className="text-color-theme text-white text-center italic presale-desc my-5">As seen on</p>
          <img src={'/images/nftcalendar_logo.png'} width={80} />
        </div>
      </a>

      <p className="text-white text-center">Copyright © 2021, All rights reserved.</p>
    </div>
  </div>;
}

export default Footer;