'use client'
import useSWR from "swr";
import { useState, useRef } from "react";
import { fetcher, getData } from "@/app/lib/data";
import { popupE } from "@/app/lib/trigger";
import Spinner from "@/app/UI/body/Spinner";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { config } from "@/app/lib/wagmi";
import { parseEther } from "ethers";
import {SolobetABI, soloAddress} from '@/app/abis/solobet.json';
import { WeiKsh, KshEth } from "@/app/lib/utils/currency";

export default function BetInfo({controll, choice, id}) {
    let optionRef = useRef(null);
    let payoutsRef = useRef(null)
    let commisionRef = useRef(null)
    if(choice == 1) optionRef.current = 'home';
    if(choice == 2) optionRef.current = 'away';
    if(choice == 0) optionRef.current = 'draw';


    let account = useAccount();

    let { data, error, isLoading } = useSWR(['/bets/info',{id}], fetcher);
    const {data:betInfo, isPending:betLoading, error:betReadError} = useReadContract({
        config,
        abi:SolobetABI,
        address: soloAddress,
        functionName: 'getBetInfo',
        account: account.address,
        args:[id.toString()],
    })
    const { writeContract, data:txHash, status:writeStatus, error:writeError, isPending:writePending } = useWriteContract({
        config,
        mutation:{
          onSuccess:(data)=>{
            getData((_)=>{},'/web3/settle',{id, choice})
          },
          onError:(error)=>{popupE('Error', error.message)}
        }
    })
    let close = (e)=>{
        alert('clicked')
        e.preventDefault();
        getData((response)=>{
            if(response.success)
            writeContract({ 
                abi:SolobetABI,
                address: soloAddress,
                functionName: 'closeBet',
                args: [
                  id.toString(),
                  choice,
                  parseEther(KshEth(response.winnings)),
                  parseEther(KshEth(response.winnersPot)),
                ],
            })
        },'/bet/close',{id, choice})
    }

    let getPayouts = (e)=>{
        e.preventDefault();
        getData((response)=>{
            if(response.length>=0){
                payoutsRef.current.innerText = JSON.stringify(response)
                let commision = 0;
                response.forEach(stake => {
                    commision += (stake.reward-stake.stake)*0.1
                });
                commisionRef.current.innerText = `Commision :: KSH ${commision}`
            }
        },'/bets/payouts',{id, choice})
    }

    return (
        <div className="bg-primary-dark md:w-[50vw] h-[50vh] py-2 px-7 rounded-lg">
            <div className="flex justify-between py-5">
                <h6 className="text-3xl font-semibold">Bet Info</h6>
                <button className="text-xl font-bold" onClick={e=>controll('')}>X</button>
            </div>
            <div className="flex w-full justify-evenly">
                <div className="w-1/2 border-r- border-gray-200">
                    <p className="font-semibold text-lg">Onchain bets</p>
                    {
                        betLoading && <div className="w-full h-[20vh] flex justify-center items-center"><Spinner/></div>
                    }
                    {
                        betInfo &&
                        Object.keys(betInfo).map((key,i)=>{
                            return (
                                <div key={i} className="flex gap-3 my-2">
                                    <p>{key} </p>
                                    <div>
                                        <p className="whitespace-nowrap">amount :: KsH {WeiKsh(betInfo[key].amount)}</p>
                                        <p>users :: {betInfo[key].stakers.length}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="w-1/2">
                    <p className="font-semibold text-lg">(Off&On)chain bets</p>
                    {
                        isLoading || error && <div className="w-full h-[20vh] flex justify-center items-center"><Spinner/></div>
                    }
                    {
                        data &&
                        data.map((bet,i)=>{
                            return(
                                <div key={i} className="flex gap-3 my-2">
                                    <p>{bet.name}</p>
                                    <div>
                                        <p className="whitespace-nowrap">amount :: KsH {bet.stake}</p>
                                        <p>users :: {bet.users}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className="my-4">
                {writeError && <p>Error {writeError.message}</p> }
            </div>

            <div className="flex gap-5 mb-6">
                <button className="bg-primary-light hover:scale-105 py-1 px-3" onClick={e=>getPayouts(e)}>Show payouts</button>
                <div>
                    <div className="my-2" ref={payoutsRef}></div>
                    <div className="my-2" ref={commisionRef}></div>
                </div>
            </div>
            <button className="flex items-center gap-3" onClick={e=>close(e)}>
                Close with <span className="bg-primary-light py-2 px-4 rounded-md hover:scale-x-110 block">{optionRef.current} WIN</span>
            </button>
        </div>
    )
}