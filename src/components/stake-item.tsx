import React from 'react';
import { STAKE_STATUS } from '../utils/constant';
import Countdown from 'react-countdown';
import { useState } from "react";

const StakeItem = ({image, name, checked, type, nft, poolData, handleButton}: any) => {

  const [isRedeemalbe, setRedeemable] = useState(false);
  let redeemableDate = new Date();
  if (type == STAKE_STATUS.STAKED) {
    redeemableDate = new Date(nft.stakeTime * 1000 + poolData.withdrawable * 24 * 3600 * 1000);
  }
  
  return <div className={`mx-2 md:mx-5 col-span-1 ${checked ? "border-4 border-purple-800" : "border border-gray-500"} rounded-lg overflow-hidden`}>
    <div className="w-full h-full flex flex-col justify-center items-center space-y-2 pb-2">
      <div className="w-full relative">
        <img src={image} width="100%" />
      </div>
      <p className="text-center text-white p-2 border-t border-gray-500"><span className="text-color-theme font-amiga">{name}</span></p>
      {
        type == STAKE_STATUS.STAKED && 
        <>
          {
            isRedeemalbe ?
              <button className="button-stake" onClick={() => handleButton(nft)}>Redeem</button>
            :
              <Countdown
                date={redeemableDate}
                onMount={({ completed }) => completed && setRedeemable(true)}
                onComplete={() => setRedeemable(true)}
                renderer={renderCounter}
              />
          }
        </>
      }
    </div>
  </div>;
}

const renderCounter = ({ days, hours, minutes, seconds }: any) => {
  return (
    <div className="text-white text-center">
      <span>
        {days}d {hours}:{minutes}:{seconds}
      </span>
    </div>
  );
};

export default StakeItem;