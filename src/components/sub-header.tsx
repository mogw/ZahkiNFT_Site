import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useState } from 'react';
import Link from 'next/link';
import { useWindowSize } from '../hooks/use-window-size';

const SubHeader = ({title}: any) => {

  const {width, height} = useWindowSize();

  return <div className="theme-header px-2 md:px-10 w-full">
    <div className="w-full h-full flex flex-row justify-center items-center md:space-x-8">
      {(width > 768) &&
        <div className="pl-3 md:pl-0">
          <Link href="/">
            <div className="flex flex-row justify-center items-center cursor-pointer">
              <div className="flex flex-row space-x-3">
                <img src={'/images/icon_back.png'} width="15" />
                <p className="text-white text-center overview-desc">Back</p>
              </div>
            </div>
          </Link>
        </div>
      }
      <div className="flex-grow flex flex-row space-x-16 items-center justify-center">
      <p className="text-white text-center header-title">{title}</p>
      </div>
      {/* <WalletMultiButton className="button-connect" /> */}
      <button className="button-connect">Connect Wallet</button>
    </div>
  </div>;
}

export default SubHeader;