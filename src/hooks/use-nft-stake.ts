import { AnchorWallet, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import * as anchor from "@project-serum/anchor";
import useWalletBalance from './use-wallet-balance';
import {AccountLayout, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID} from "@solana/spl-token";
import { programs } from '@metaplex/js';
import moment from 'moment';
import toast from 'react-hot-toast';
import {
    Keypair,
    PublicKey,
    Transaction,
    ConfirmOptions,
    SYSVAR_CLOCK_PUBKEY,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import axios from "axios";
import { STAKE_DATA_SIZE, STAKE_CONTRACT_IDL } from '../utils/constant';

const { metadata: { Metadata } } = programs;
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const rpcHost = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);
const programId = new PublicKey(process.env.NEXT_PUBLIC_STAKE_CONTRACT_ID!);
const pool = new PublicKey(process.env.NEXT_PUBLIC_STAKE_POOL_ID!);
const idl = STAKE_CONTRACT_IDL as anchor.Idl;
const confirmOption : ConfirmOptions = {
    commitment : 'finalized',
    preflightCommitment : 'finalized',
    skipPreflight : false
}

const createAssociatedTokenAccountInstruction = (
        associatedTokenAddress: anchor.web3.PublicKey,
        payer: anchor.web3.PublicKey,
        walletAddress: anchor.web3.PublicKey,
        splTokenMintAddress: anchor.web3.PublicKey
    ) => {
    const keys = [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
      { pubkey: walletAddress, isSigner: false, isWritable: false },
      { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
      {
        pubkey: anchor.web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      {
        pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ];
    return new anchor.web3.TransactionInstruction({
      keys,
      programId: ASSOCIATED_TOKEN_PROGRAM_ID,
      data: Buffer.from([]),
    });
}

const sendTransaction = async (transaction : Transaction, signers : Keypair[], wallet: AnchorWallet) => {
    try{
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash;
        await transaction.setSigners(wallet.publicKey,...signers.map(s => s.publicKey));
        if(signers.length != 0) await transaction.partialSign(...signers);
        const signedTransaction = await wallet.signTransaction(transaction);
        let hash = await connection.sendRawTransaction(await signedTransaction.serialize());
        await connection.confirmTransaction(hash);
        toast.success('Transaction succeed.');
    } catch(err) {
        console.log(err);
        toast.error('Transaction failed. Please try again.');
    }
}

const getTokenWallet = async (wallet: anchor.web3.PublicKey, mint: anchor.web3.PublicKey) => {
    return (
      await anchor.web3.PublicKey.findProgramAddress(
        [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    )[0];
};

const getMetadata = async (mint: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
    return (
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
};

const getPoolData = async (wallet: AnchorWallet) => {
    let provider = new anchor.Provider(connection , wallet, confirmOption);
    const program = new anchor.Program(idl,programId,provider);
    let fetchData = await program.account.pool.fetch(pool);
    const poolData = {
        rewardMint : fetchData.rewardMint,
        rewardAccount : fetchData.rewardAccount,
        rewardAmount : fetchData.rewardAmount.toNumber(),
        period : fetchData.period.toNumber(),
        withdrawable : fetchData.withdrawable,
        stakeCollection : fetchData.stakeCollection
    }
    return poolData;
}

const getStakedNftsForOwner = async (wallet: AnchorWallet) => {
    const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions());
    const program = new anchor.Program(idl, programId, provider);
    const allTokens: any = [];
    try {
        let resp = await connection.getProgramAccounts(programId,
            {
                dataSlice: {
                    length: 0, 
                    offset: 0
                },
                filters: [
                    {
                        dataSize: STAKE_DATA_SIZE
                    },
                    {
                        memcmp:{
                            offset: 9,
                            bytes: wallet.publicKey.toBase58()
                        }
                    },
                    {
                        memcmp: {
                            offset: 41,
                            bytes: pool.toBase58()
                        }
                    }
                ]
            }
        );

        for(let nftAccount of resp){
            let stakedNft = await program.account.stakeData.fetch(nftAccount.pubkey);
            if (stakedNft.unstaked) continue;
            let account = await connection.getAccountInfo(stakedNft.account);
            let mint = new PublicKey(AccountLayout.decode(account!.data).mint);
            let pda = await getMetadata(mint);
            const accountInfo: any = await connection.getParsedAccountInfo(pda);
            let metadata : any = new Metadata(wallet.publicKey.toString(), accountInfo.value);
            const { data }: any = await axios.get(metadata.data.data.uri);
            const entireData = { ...data, id: Number(data.name.replace( /^\D+/g, '').split(' - ')[0])};
            allTokens.push({
                withdrawnNumber : stakedNft.withdrawnNumber,
                stakeTime : stakedNft.stakeTime.toNumber(),
                stakeData : nftAccount.pubkey,
                address : mint,
                ...entireData,
            });
        }
    } catch (e) {
        console.log(e);
    }
    return allTokens;
}

const getClaimAmount = async (wallet: AnchorWallet) => {
    const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions());
    const program = new anchor.Program(idl, programId, provider);
    let resp = await connection.getProgramAccounts(programId, {
        dataSlice: {
            length: 0, 
            offset: 0
        },
        filters: [
            {
                dataSize: STAKE_DATA_SIZE
            },
            {
                memcmp: {
                    offset:9,
                    bytes:wallet.publicKey.toBase58()
                }
            },
            {
                memcmp: {
                    offset:41,
                    bytes:pool.toBase58()
                }
            }
        ]
    })
    let claimAmount = 0;
    const poolData: any = await getPoolData(wallet);
  
    for(let stakeAccount of resp){
        let stakedNft = await program.account.stakeData.fetch(stakeAccount.pubkey);
        let num = (moment().unix() - stakedNft.stakeTime.toNumber()) / poolData.period;
        if(num > poolData.withdrawable) num = poolData.withdrawable;
        claimAmount += poolData.rewardAmount * (num - stakedNft.withdrawnNumber);
    }
  
    return claimAmount;
}

const stake = async (nftMint : PublicKey, wallet: AnchorWallet) => {
	let provider = new anchor.Provider(connection, wallet, confirmOption);
    let program = new anchor.Program(idl,programId, provider);
    const stakeData = Keypair.generate();
    const metadata = await getMetadata(nftMint);
    const sourceNftAccount = await getTokenWallet(wallet.publicKey, nftMint);
    const destNftAccount = await getTokenWallet(pool, nftMint);
    let transaction = new Transaction();
    let signers : Keypair[] = [];
    signers.push(stakeData);

    if((await connection.getAccountInfo(destNftAccount)) == null)
        transaction.add(createAssociatedTokenAccountInstruction(destNftAccount, wallet.publicKey, pool, nftMint))
    transaction.add(
        await program.instruction.stake({
            accounts: {
                owner : wallet.publicKey,
                pool : pool,
                stakeData : stakeData.publicKey,
                nftMint : nftMint,
                metadata : metadata,
                sourceNftAccount : sourceNftAccount,
                destNftAccount : destNftAccount,
                tokenProgram : TOKEN_PROGRAM_ID,
                systemProgram : anchor.web3.SystemProgram.programId,
                clock : SYSVAR_CLOCK_PUBKEY
            }
        })
    );
    await sendTransaction(transaction, signers, wallet);
}

const unstake = async (stakeData : PublicKey, wallet : AnchorWallet) => {
    let provider = new anchor.Provider(connection, wallet, confirmOption);
    let program = new anchor.Program(idl,programId,provider);
    let stakedNft = await program.account.stakeData.fetch(stakeData);
    let account = await connection.getAccountInfo(stakedNft.account);
    let mint = new PublicKey(AccountLayout.decode(account!.data).mint);
    const destNftAccount = await getTokenWallet(wallet.publicKey,mint);
    let transaction = new Transaction();
  
    transaction.add(
      await program.instruction.unstake({
        accounts:{
            owner : wallet.publicKey,
            pool : pool,
            stakeData : stakeData,
            sourceNftAccount : stakedNft.account,
            destNftAccount : destNftAccount,
            tokenProgram : TOKEN_PROGRAM_ID,
            clock : SYSVAR_CLOCK_PUBKEY
        }
      })
    );
    await sendTransaction(transaction, [], wallet);
}

async function claim(wallet : AnchorWallet) {
    let provider = new anchor.Provider(connection, wallet, confirmOption);
    let program = new anchor.Program(idl,programId,provider)  
    let resp = await connection.getProgramAccounts(programId, {
        dataSlice: {
            length: 0, 
            offset: 0
        },
        filters: [
            {
                dataSize: STAKE_DATA_SIZE
            },
            {
                memcmp: {
                    offset:9,
                    bytes:wallet.publicKey!.toBase58()
                }
            },
            {
                memcmp: {
                    offset:41,
                    bytes:pool.toBase58()
                }
            }
        ]
    });
    const poolData: any = await getPoolData(wallet);
    let destRewardAccount = await getTokenWallet(wallet.publicKey, poolData.rewardMint);
    let transaction = new Transaction();
    if((await connection.getAccountInfo(destRewardAccount)) == null)
        transaction.add(createAssociatedTokenAccountInstruction(destRewardAccount,wallet.publicKey,wallet.publicKey, poolData.rewardMint))  
    for(let stakeAccount of resp) {
        let stakedNft = await program.account.stakeData.fetch(stakeAccount.pubkey);
        let num = (moment().unix() - stakedNft.stakeTime.toNumber()) / poolData.period;
        if (stakedNft.withdrawnNumber >= poolData.withdrawable) continue;
        if (num > poolData.withdrawable) num = poolData.withdrawable;
        transaction.add(
            await program.instruction.claim({
                accounts:{
                    owner : wallet.publicKey,
                    pool : pool,
                    stakeData : stakeAccount.pubkey,
                    sourceRewardAccount : poolData.rewardAccount,
                    destRewardAccount : destRewardAccount,
                    tokenProgram : TOKEN_PROGRAM_ID,
                    clock : SYSVAR_CLOCK_PUBKEY,
                }
            })
        )
    };
    await sendTransaction(transaction, [], wallet);
}

const useNftStake = () => {
    const [balance, setBalance] = useWalletBalance();
    const anchorWallet = useAnchorWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [stakedNfts, setStakedNfts] = useState<Array<any>>([]);
    const [claimAmount, setClaimAmount] = useState(0);
    const [poolData, setPoolData] = useState({});

    useEffect(() => {
        (async () => {
            if (
                !anchorWallet ||
                !anchorWallet.publicKey ||
                !anchorWallet.signAllTransactions ||
                !anchorWallet.signTransaction
            ) {
                return;
            }

            setIsLoading(true);

            const poolDataForOwner: any = await getPoolData(anchorWallet);
            setPoolData(poolDataForOwner);
            const stakedNftsForOwner = await getStakedNftsForOwner(anchorWallet);
            setStakedNfts(stakedNftsForOwner);
            const claimAmountForOwner = Math.floor(await getClaimAmount(anchorWallet));
            setClaimAmount(claimAmountForOwner);

            setIsLoading(false);
        })();
    }, [anchorWallet, balance]);

    const updateBalance = async (wallet: AnchorWallet) => {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
    }

    const stakeNft = async (nftMint : PublicKey) => {
        if (!anchorWallet) {
            toast.error('Connect wallet first, please.');
            return;
        }

        setIsLoading(true);

        await stake(nftMint, anchorWallet);
        await updateBalance(anchorWallet);

        setIsLoading(false);
    }

    const unstakeNft = async (stakeData : PublicKey) => {
        if (!anchorWallet) {
            toast.error('Connect wallet first, please.');
            return;
        }

        setIsLoading(true);

        await unstake(stakeData, anchorWallet);
        await updateBalance(anchorWallet);

        setIsLoading(false);
    }

    const claimRewards = async () => {
        if (!anchorWallet) {
            toast.error('Connect wallet first, please.');
            return;
        }

        setIsLoading(true);

        await claim(anchorWallet);
        await updateBalance(anchorWallet);

        setIsLoading(false);
    }

    return { isLoading, poolData, stakedNfts, claimAmount, stakeNft, unstakeNft, claimRewards };
}

export default useNftStake;