import Head from 'next/head'

import { Toaster } from 'react-hot-toast';
import SubHeader from '../components/sub-header';
import StakeItem from '../components/stake-item';
import useWalletNfts from '../hooks/use-wallet-nfts';
import { useWallet } from '@solana/wallet-adapter-react';
import { STAKE_STATUS } from '../utils/constant';
import { useState, useRef, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import useNftStake from '../hooks/use-nft-stake';

const Stake = () => {

    const [visibleWalletNftDialog, setVisibleWalletNftDialog] = useState(false);
    const wallet = useWallet();
    const { isLoadingWalletNfts, walletNfts, setWalletNfts } = useWalletNfts();
    const { isLoading, poolData, stakedNfts, claimAmount, stakeNft, unstakeNft, claimRewards } = useNftStake();
    const cancelButtonRef = useRef(null);

    const handleStakeNfts = async () => {
        const selectedNfts = walletNfts.filter((nft: any) => {if (nft.checked) return nft;});
        if (selectedNfts.length == 0) {
            toast.error("Please select Gorilla at least one.");
            return;
        }

        setVisibleWalletNftDialog(false);

        for (let i = 0; i < selectedNfts.length; i++) {
            const nft = selectedNfts[i];
            await stakeNft(nft.address);
        }
    }

    const handleSelectUnstakeNft = (index: number) => {
        setWalletNfts(walletNfts.map((nft: any, idx: number) => {
            if (index == idx) {
                return {
                    ...nft,
                    checked: !nft.checked
                };
            }
            return nft;
        }));
    }

    const handleStakeButton = () => {
        setWalletNfts(walletNfts.map((nft: any) => {
            return {
                ...nft,
                checked: false
            };
        }));

        setVisibleWalletNftDialog(true);
    }

    const handleUnstake = async (nft: any) => {
        await unstakeNft(nft.stakeData);
    }

    const handleClaim = async () => {
        await claimRewards();
    }

    return (
        <div>
            <Toaster />
            <Head>
                <title>Gorilla Galaxy</title>
                <meta name="description" content="Genesis is a collection of 4444 unique, randomly generated Gorillas roaming on the Solana blockchain." />
                <link rel="icon" href="/icon.png" />
            </Head>
    
            <SubHeader title="STAKING" />

            {wallet.connected ?
            <section>
                <h3 className="text-white text-center presale-title drop-shadow-lg py-10">Your staked Gorillas:</h3>

                <div className="w-full flex justify-center items-center">
                    {
                        stakedNfts.length > 0 ?
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:px-10 py-8">
                            {
                                stakedNfts.map((nft: any, idx: number) => {
                                    return <StakeItem 
                                                key={idx} 
                                                image={nft.image} 
                                                name={nft.name} 
                                                type={STAKE_STATUS.STAKED} 
                                                nft={nft} 
                                                poolData={poolData} 
                                                handleButton={handleUnstake}
                                            >
                                            </StakeItem>;
                                })
                            }
                            </div>
                        :
                            <p className="text-color-theme text-center font-amiga mb-5">You didn't stake any Gorillas.</p>
                    }
                </div>

                <h3 className="text-white text-center presale-title drop-shadow-lg py-10">Stake a gorilla:</h3>

                <div className="w-full flex justify-center items-center">
                    <button className="button-connect" onClick={() => handleStakeButton()}>STAKE</button>
                </div>

                <h3 className="text-white text-center presale-title drop-shadow-lg py-10">Staking Rewards:</h3>

                <div className="w-full flex flex-col justify-center items-center">
                    <p className="text-color-theme text-center font-amiga mb-5">{claimAmount} $GLUE</p>
                    <button className="button-connect" onClick={() => handleClaim()}>CLAIM</button>
                </div>

                <br />
            </section>
            :
            <section>
                <p className="text-color-theme text-center font-amiga py-10">Please connect wallet first.</p>
            </section>
            }

            <Transition.Root show={visibleWalletNftDialog} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setVisibleWalletNftDialog}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                        <div className="inline-block align-bottom theme-section-background rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-4/5">
                            <div className="theme-section-background px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-600">
                                        Select Gorillas to be staked.
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            If you stake your Gorilla, you can earn 10 $GLUE tokens for each Gorilla everyday during staked(Max: 7 days).
                                        </p>
                                        <div className="w-full flex justify-center items-center">
                                        {
                                            walletNfts.length > 0 ?
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:px-10 py-8">
                                                {
                                                    walletNfts.map((nft: any, idx: number) => {
                                                        return <button key={idx} onClick={() => handleSelectUnstakeNft(idx)}>
                                                            <StakeItem 
                                                                image={nft.image} 
                                                                name={nft.name} 
                                                                checked={nft.checked} 
                                                                type={STAKE_STATUS.UNSTAKED} 
                                                                poolData={poolData} 
                                                                nft={nft} 
                                                                handleButton={null}
                                                            >
                                                            </StakeItem>
                                                        </button>;
                                                    })
                                                }
                                                </div>
                                            :
                                                <p className="text-color-theme text-center font-amiga my-5">You have no Gorillas.</p>
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="theme-section-background px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-800 text-base font-medium text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-800 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => handleStakeNfts()}
                                >
                                    Stake
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-800 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setVisibleWalletNftDialog(false)}
                                    ref={cancelButtonRef}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {(wallet.connected && (isLoading || isLoadingWalletNfts)) &&
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
        </div>
    );
};

export default Stake;
