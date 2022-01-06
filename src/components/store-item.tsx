import React, { useState } from 'react';
import Link from 'next/link';
import { useWindowSize } from '../hooks/use-window-size';

const StoreItem = ({image, title, price}: any) => {

  const {width, height} = useWindowSize();

  return <div className="mx-2 md:mx-5 col-span-1 border border-gray-500 rounded-lg overflow-hidden">
    <div className="w-full h-full flex flex-col justify-center items-center space-y-2 pb-2">
      <div className="w-full relative">
        <img src={image} width="100%" />
        <p className="absolute bottom-0 w-full p-2 bg-gradient-to-b from-transparent via-black to-black text-white text-center font-amiga">{title}</p>
      </div>
      <p className="w-1/2 text-center text-white p-2 border border-gray-500 rounded-full"><span className="font-bold">{price}</span> &nbsp;&nbsp; <span className="text-color-theme font-bold">$GLUE</span></p>
    </div>
  </div>;
}

export default StoreItem;