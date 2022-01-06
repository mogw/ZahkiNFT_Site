import Head from 'next/head'
import { Fragment, useState, useRef, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { useWallet } from "@solana/wallet-adapter-react";
import useCandyMachine from '../hooks/use-candy-machine';
import Header from '../components/header';
import Footer from '../components/footer';
import useWalletBalance from '../hooks/use-wallet-balance';
import Countdown from 'react-countdown';
import { useWindowSize } from '../hooks/use-window-size';
import Link from 'next/link';

const Home = () => {
  const wallet = useWallet();
  const [balance] = useWalletBalance();
  const [isActive, setIsActive] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { isSoldOut, mintStartDate, isMinting, onMintNFT, nftsData } = useCandyMachine();
  const [imageIndex, setImageIndex] = useState(1);
  const [activeFaqIndex, setActiveFaqIndex] = useState(-1);

  const {width, height} = useWindowSize();

  const mintRef = useRef(null);
  const aboutRef = useRef(null);
  const teamRef = useRef(null);
  const roadmapRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    const timer=setTimeout(() => {
      let index = (imageIndex + 1) % 10;
      if (index == 0) index = 1;
      if (index > 9) index = 9;
      setImageIndex(index);
    }, 200);
    return () => clearTimeout(timer);
  });

  const handleFaq = (index: number) => {
    if (index == activeFaqIndex) {
        setActiveFaqIndex(-1);
    } else {
        setActiveFaqIndex(index);
    }
  }

  return (
    <main>
      <Toaster />

      <Head>
        <title>Gorilla Galaxy</title>
        <meta name="description" content="Genesis is a collection of 4444 unique, randomly generated Gorillas roaming on the Solana blockchain." />
        <link rel="icon" href="/icon.png" />
      </Head>

      <Header mintRef={mintRef} aboutRef={aboutRef} teamRef={teamRef} roadmapRef={roadmapRef} faqRef={faqRef} />

      <section>
        <div className="w-full flex justify-center items-center">
          <img src={'/images/background.png'} width="100%" />
        </div>
        <div className="">
          <h3 className="text-color-theme text-center overview-title drop-shadow-lg"></h3>
          <p className="text-white text-center overview-desc px-5 md:px-24"></p>
        </div>
      </section>

      <section ref={mintRef}>
        <h3 className="text-white text-center presale-title drop-shadow-lg pb-10">Mint a Galaxy Shuttle Pass</h3>
        <div className="flex flex-row justify-center items-center space-x-10 px-5">
          <div className="flex flex-col justify-center items-center space-y-3">

            {!wallet.connected && 
              <span
                className="text-gray-800 font-bold text-2xl cursor-default">
                Wallet not connected.
                <br />
                Please select wallet...

                {/* Coming soon... */}
              </span>
            }

            {wallet.connected && isActive &&
              <>
                <p className="text-white font-bold text-lg cursor-default text-center">Price 1 SOL</p>
                <p className="text-white font-bold text-lg cursor-default text-center">Minted / Total <br /> {nftsData.itemsRedeemed} / {nftsData.itemsAvailable}</p>
              </>
            }

            <div className="flex flex-col justify-start items-start">
              {wallet.connected &&
                <>
                  {/* {isActive &&
                    <input 
                      min={1}
                      max={10}
                      type="number" 
                      className="input-number"
                      onChange={(e) => setQuantity(Number(e.target.value))} 
                      style={{border: 'solid 1px grey', textAlign: 'center', width: '90%', margin: 5}} 
                      value={quantity} />
                  } */}

                  <button
                    disabled={isSoldOut || isMinting || !isActive}
                    onClick={() => onMintNFT(quantity)}
                    className="inline-block button-connect flex justify-center items-center mt-5"
                  >
                    {isSoldOut ? 
                        ("SOLD OUT") 
                      : isActive ?
                          isMinting ? 
                            <div className="loader"></div>
                          : 
                            <span>
                              MINT 
                              {/* {quantity} */}
                            </span>
                        :
                        <Countdown
                          date={mintStartDate}
                          onMount={({ completed }) => completed && setIsActive(true)}
                          onComplete={() => setIsActive(true)}
                          renderer={renderCounter}
                        />
                    }
                  </button>
                </>
              }
            </div>
          </div>
          <div className="flex justify-center items-center outer-glow">
            {/* <img src={`/images/art${imageIndex}.png`} width={200} /> */}
            <img src='/images/shuttle_pass.gif' width={200} />
          </div>
        </div>
      </section>
      
      <section ref={aboutRef}>
        <div className="w-full flex justify-center items-center relative px-5 md:px-10">
          <div className="flex flex-col md:flex-row justify-center items-center space-x-5">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
              <h3 className="text-white text-center overview-title drop-shadow-lg">Genesis</h3>
              <div className="overview-desc-panel text-white p-5">
                Gorilla Galaxy: Genesis is a collection of 4444 unique, randomly generated Gorillas roaming on the Solana blockchain. 
                <br />
                <br />
                Every Genesis Gorilla is unique and programmatically generated from over 130+ possible attributes and traits like background, fur, clothes, mouth, head, earrings and eyes. Some gorillas will be rarer than others. 
                <br />
                <br />
                Your genesis gorilla isn't just a cool picture. It is your ticket into our ecosystem, bringing you value in the real and digital world.
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <img src={'/images/overview.png'} className="z-order-content" />
              <div className="remove-watermark z-order-top"></div>
            </div>
          </div>          
        </div>
      </section>

      <section ref={roadmapRef}>
        <h5 className="text-white presale-title drop-shadow-lg text-center pb-10">Gorilla Ops</h5>
        <div className="w-full flex flex-col px-5 md:px-10 justify-center items-center">
          <div className="phase-panel w-full md:w-5/6">
            <div className="my-10">
              <h5 className="text-color-theme presale-desc mb-5">
                25% - GGG Giveaway
              </h5>
              <p className="text-white overview-desc">
                10x 5 SOL giveaway back to the minters of the collection.
              </p>
            </div>

            <div className="my-10">
              <h5 className="text-color-theme presale-desc mb-5">
                50% - Chimp Change
              </h5>
              <p className="text-white overview-desc">
                250 SOL is added to the community wallet. The community wallet will be used for various purposes decided by Gorilla Galaxy: Genesis holders. 
              </p>
            </div>

            <div className="my-10">
              <h5 className="text-color-theme presale-desc mb-5">
                75% - $GLUE
              </h5>
              <p className="text-white overview-desc">
                $GLUE token research and integration begins. This will be distributed to all Gorilla Galaxy: Genesis holders. Details TBA.
              </p>
            </div>

            <div className="my-10">
              <h5 className="text-color-theme presale-desc mb-5">
                100% - Enter the Gorillaverse
              </h5>
              <p className="text-white overview-desc">
                3D versions of all Genesis Gorillas will begin to roll out. These will be claimable with the $GLUE token.
              </p>
            </div>

            <div className="my-10">
              <p className="text-white overview-desc">
                <br />
                <br />
                We aim to have these models available for Solana metaverse integration when it is available.
                <br />
                <br />
                More to come with Gorilla Ops v2.0....
              </p>
            </div>
          </div>
        </div>
      </section>

      <section ref={faqRef}>
        <div className="w-full px-5 md:px-16 pb-10 relative">
          <h3 className="text-white presale-title pb-10 text-center">FAQ</h3>

          <div className="panel-faq">
            <div className={activeFaqIndex == 0 ? 'faq active-faq' : 'faq'}>
                <div className='faq-header' onClick={() => handleFaq(0)}>
                    <div>Blockchain?</div>
                    <div className='faq-icon'>{activeFaqIndex == 0 ? <img src={'/images/icon_faq_active.png'} width='20' /> : <img src={'/images/icon_faq.png'} width='12' />}</div>
                </div>
                <div className={activeFaqIndex == 0 ? 'active-faq-content' : 'faq-content'}>Solana</div>
            </div>
            <div className={activeFaqIndex == 1 ? 'faq active-faq' : 'faq'}>
                <div className='faq-header' onClick={() => handleFaq(1)}>
                    <div>Supply?</div>
                    <div className='faq-icon'>{activeFaqIndex == 1 ? <img src={'/images/icon_faq_active.png'} width='20' /> : <img src={'/images/icon_faq.png'} width='12' />}</div>
                </div>
                <div className={activeFaqIndex == 1 ? 'active-faq-content' : 'faq-content'}>The total supply of Genesis gorillas is 4,444.</div>
            </div>
            <div className={activeFaqIndex == 2 ? 'faq active-faq' : 'faq'}>
                <div className='faq-header' onClick={() => handleFaq(2)}>
                    <div>When?</div>
                    <div className='faq-icon'>{activeFaqIndex == 2 ? <img src={'/images/icon_faq_active.png'} width='20' /> : <img src={'/images/icon_faq.png'} width='12' />}</div>
                </div>
                <div className={activeFaqIndex == 2 ? 'active-faq-content' : 'faq-content'}>Feb 2nd 2022</div>
            </div>
            <div className={activeFaqIndex == 3 ? 'faq active-faq' : 'faq'}>
                <div className='faq-header' onClick={() => handleFaq(3)}>
                    <div>Mint price?</div>
                    <div className='faq-icon'>{activeFaqIndex == 3 ? <img src={'/images/icon_faq_active.png'} width='20' /> : <img src={'/images/icon_faq.png'} width='12' />}</div>
                </div>
                <div className={activeFaqIndex == 3 ? 'active-faq-content' : 'faq-content'}>Genesis gorillas will cost 0.77 SOL each to mint.</div>
            </div>
            <div className={activeFaqIndex == 4 ? 'faq active-faq' : 'faq'}>
                <div className='faq-header' onClick={() => handleFaq(4)}>
                    <div>Token?</div>
                    <div className='faq-icon'>{activeFaqIndex == 4 ? <img src={'/images/icon_faq_active.png'} width='20' /> : <img src={'/images/icon_faq.png'} width='12' />}</div>
                </div>
                <div className={activeFaqIndex == 4 ? 'active-faq-content' : 'faq-content'}>The token name is $GLUE, this will be released after the collection is sold out. (1 TOKEN = 1 TOKEN)</div>
            </div>
          </div>
        </div>
      </section>

      <section ref={teamRef}>
        <h3 className="text-white text-center overview-title drop-shadow-lg pb-10">GORILLA GALAXY TEAM</h3>
        <div className="w-full flex justify-center items-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-8 px-5 md:px-10">
            <div className="col-span-1"></div>

            <div className="col-span-2 flex flex-col justify-center items-center">
              <img src={'/images/team1.png'} width={"80%"} />
              <div className="flex flex-row justify-center items-center space-x-4 mt-5 mb-3">
                <h5 className="text-color-theme text-center team-title">Non-Fungibro</h5>
                <a href="https://twitter.com/NonFungibro?s=21" target="_blank">
                  <img src={'/images/icon_twitter.png'} width={30} height={30} />
                </a>
              </div>
              <p className="text-white text-center overview-desc">CO-FOUNDER</p>
            </div>

            <div className="col-span-2 flex flex-col justify-center items-center">
              <img src={'/images/team2.png'} width={"80%"} />
              <div className="flex flex-row justify-center items-center space-x-4 mt-5 mb-3">
                <h5 className="text-color-theme text-center team-title">CDZ</h5>
                <a href="https://twitter.com/cdz999" target="_blank">
                  <img src={'/images/icon_twitter.png'} width={30} height={30} />
                </a>
              </div>
              <p className="text-white text-center overview-desc">CO-FOUNDER</p>
            </div>

            <div className="col-span-1"></div>
          </div>
        </div>
      </section>

      <section>
        <div className="w-full flex justify-center items-center px-5 md:px-10 mb-10">
          <div className="w-full md:w-2/3 flex flex-col justify-center items-center">
            <h3 className="text-color-theme text-center presale-title drop-shadow-lg">Community</h3>
            <div className="w-full flex justify-center items-center">
              <Link href="/"><img src={'/images/logo.png'} width={200} className="cursor-pointer" /></Link>
            </div>
            <a href="https://discord.gg/GZpTs7pG27" target="_blank">
              <button className="button-connect">JOIN OUR DISCORD</button>
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {(wallet.connected && isMinting) &&
        <div className="w-full h-full fixed block top-0 left-0 bg-black opacity-75 z-50 flex justify-center items-center">
          <div
            className="
              animate-spin
              rounded-full
              h-32
              w-32
              border-t-2 border-b-2 border-white
            "
          ></div>
        </div>
      }
    </main>
  );
};

const renderCounter = ({ days, hours, minutes, seconds }: any) => {
  return (
    <div className="panel-mint-timer">
      <span>
        Live in {days > 0 && <span>{days}d</span>} {hours}:{minutes}:{seconds} 
      </span>
    </div>
  );
};

export default Home;



