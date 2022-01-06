import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useState } from 'react';
import Link from 'next/link';
import { useWindowSize } from '../hooks/use-window-size';
import { useLocalStorage } from '@solana/wallet-adapter-react';

const Header = ({mintRef, aboutRef, teamRef, roadmapRef, faqRef}: any) => {

  const {width, height} = useWindowSize();

  const [isMenuShowed, setIsMenuShowed] = useState(false);
  const [tag, setTag] = useLocalStorage("TAG", "");

  const handleClickMenu = () => {
    setIsMenuShowed(!isMenuShowed);
  }

  const scrollTo = (ref: any, tag: string) => {
    if (ref == undefined || ref == null) {
      setTag(tag);
      window.location.href = '/';
    } else {
      window.scroll(
        {
          top: ref.current.offsetTop,
          behavior: "smooth",
        }
      );
    }
    
    if (width <= 1280) handleClickMenu();
  }

  return <div className="theme-header md:px-10 w-full">
    <div className="w-full flex flex-row justify-center items-center md:space-x-8">
      <div className="pl-3 md:pl-0">
        <Link href="/"><img src={'/images/logo.png'} width={(width > 768) ? '100px' : '70px'} className="cursor-pointer" /></Link>
      </div>
      {width > 1280 ?
        <>
          <div className="flex-grow flex flex-row space-x-12 items-center justify-center">
            <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none font-amiga" onClick={() => scrollTo(mintRef, 'MINT')} >
              MINT
            </button>
            <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none font-amiga" onClick={() => scrollTo(aboutRef, 'ABOUT')} >
              ABOUT
            </button>
            <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none font-amiga" onClick={() => scrollTo(teamRef, 'TEAM')} >
              TEAM
            </button>
            <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none font-amiga" onClick={() => scrollTo(roadmapRef, 'ROADMAP')} >
              ROADMAP
            </button>
            <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none font-amiga" onClick={() => scrollTo(faqRef, 'FAQ')} >
              FAQ
            </button>
            {/* <Link href="/store">
              <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none font-amiga" >
                STORE
              </button>
            </Link>
            <Link href="/stake">
              <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none font-amiga" >
                STAKE
              </button>
            </Link> */}
          </div>
          <WalletMultiButton className="button-connect" />
          {/* <button className="button-connect">Connect Wallet</button> */}
        </>
        :
        <>
          <div className="flex-grow flex justify-center items-center">
            <WalletMultiButton className="button-connect" />
            {/* <button className="button-connect">Connect Wallet</button> */}
          </div>
          <button className="inline-flex justify-center items-center pr-3" onClick={handleClickMenu} >
            <img src={'/images/icon_menu.png'} width="35" />
          </button>
        </>
      }
    </div>
    {isMenuShowed &&
      <div className="flex flex-col space-y-2 w-full theme-bg-color p-2">
        <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none header-menu-item font-amiga" onClick={() => scrollTo(mintRef, 'MINT')} >
          MINT
        </button>
        <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none header-menu-item font-amiga" onClick={() => scrollTo(aboutRef, 'ABOUT')} >
          ABOUT
        </button>
        <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none header-menu-item font-amiga" onClick={() => scrollTo(teamRef, 'TEAM')} >
          TEAM
        </button>
        <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none header-menu-item font-amiga" onClick={() => scrollTo(roadmapRef, 'ROADMAP')} >
          ROADMAP
        </button>
        <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none header-menu-item font-amiga" onClick={() => scrollTo(faqRef, 'FAQ')} >
          FAQ
        </button>
        {/* <Link href="/store">
          <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none header-menu-item font-amiga" onClick={() => handleClickMenu()} >
            STORE
          </button>
        </Link>
        <Link href="/stake">
          <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none header-menu-item font-amiga" onClick={() => handleClickMenu()} >
            STAKE
          </button>
        </Link> */}

        <div className="grid grid-cols-6 gap-6 pt-5">
          <div className="col-span-1"></div>
          <div className="col-span-1"></div>
          <a href="https://twitter.com/gorillaglxy" className="inline-flex text-center justify-center items-center">
            <img src={'/images/icon_twitter.png'} />
          </a>
          <a href="https://discord.gg/GZpTs7pG27" className="inline-flex text-center justify-center items-center">
            <img src={'/images/icon_discord.png'} />
          </a>
          <div className="col-span-1"></div>
          <div className="col-span-1"></div>
        </div>
      </div>
    }
  </div>;
}

export default Header;