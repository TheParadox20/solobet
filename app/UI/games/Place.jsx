'use client'
import { useState, useEffect, useRef, useContext } from "react"
import { Context } from "@/app/lib/ContextProvider"
import Input from "@/app/UI/Input"
import { nowYouDont } from "@/app/lib/controlls";
import { overlayE, popupE } from "@/app/lib/trigger";
import { postData } from "@/app/lib/data";
import useUser from "@/app/lib/hooks/useUser";
import useBetslip from "@/app/lib/hooks/useBetslip";
import {SolobetABI, soloAddress} from '@/app/abis/solobet.json';
import { useWriteContract, useAccount } from "wagmi";
import { config } from "@/app/lib/wagmi";
import { parseEther } from "ethers";
import { KshEth } from "@/app/lib/utils/currency";

export default function Place(){
    let {isLogged, Settings, BaseRate} = useContext(Context);
    let [settings, setSettings] = Settings;
    let [amount, setAmount] = useState(settings.defaultStake);
    let [match, setMatch] = useState('');
    let [pot, setPot] = useState(0);
    let [users, setUsers] = useState(0);
    let [stakes, setStakes] = useState(0);
    let [market, setMarket] = useState('WIN');
    let [option, setOption] = useState('');

    let awardRef = useRef('');
    let outcomeRef = useRef(0);
    let idRef = useRef(0);
    let {updateBalance} = useUser();
    let {mutate} = useBetslip();

    const account = useAccount()
    const { writeContract, data:txHash, status:writeStatus, error:writeError, isPending:writePending } = useWriteContract({config,mutation:{
        onSuccess:()=>{
            postData((_)=>{popupE('Success',`Bet placed`)},{
                game: idRef.current,
                amount,
                choice: outcomeRef.current,
                web3:true
            },'/bet/place')
        }
    }})
    if(writePending) popupE('Processing', 'Accept transaction in wallet')
    if(writeError) popupE('Error',writeError.message)

    useEffect(()=>{
        window.addEventListener('place', e=>handler(e))
        return ()=>window.removeEventListener('place', e=>handler(e))
    },[])

    useEffect(()=>{
        if(amount == NaN) setAmount(0)
        const newAward = ((amount / (stakes + amount)) * pot + amount);
        if (newAward == NaN) awardRef.current.innerText = `KSH ${0.00}`;
        else awardRef.current.innerText = `KSH ${newAward.toFixed(2)}`;
    },[amount])

    let handler = e => {
        if(e.detail.game.outcome==0)   outcomeRef.current = 1;
        if(e.detail.game.outcome==1)   outcomeRef.current = 0;
        if(e.detail.game.outcome==2)   outcomeRef.current = 2;
        idRef.current = e.detail.game.id
        setMatch(e.detail.game.match)
        awardRef.current.innerText = `KSH ${((amount/(e.detail.game.choice.stake+amount))*e.detail.game.pot+amount).toFixed(2)}`;
        setPot(e.detail.game.pot)
        setUsers(e.detail.game.choice.users)
        setStakes(e.detail.game.choice.stake)
        if(e.detail.game.choice.name != 'Draw') setOption(e.detail.game.choice.name)
        else setOption('')
        if(e.detail.game.choice.name == 'Draw') setMarket('DRAW')
        else setMarket('WIN')
        setAmount(amount)
    }

    let place = e=>{
        if(account.status=='connected'){
            writeContract({ 
                abi:SolobetABI,
                address: soloAddress,
                functionName: 'placeBet',
                value:parseEther(KshEth(amount)),
                args: [
                    idRef.current.toString(),//game PK
                    outcomeRef.current
                ],
            })
        }else{
            postData((response)=>{
                if(response.message){
                    updateBalance(-amount)
                    mutate()
                }
            },{
                game: idRef.current,
                amount,
                choice: outcomeRef.current
            },'/bet/place')
        }
    }

    return(
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <div className="">
                    <p className="font-semibold 2xl:text-lg text-base mb-2"><span className="text-primary-light mr-2">{market}</span>{option}</p>
                    <p className="mb-2">Full Time Result</p>
                    <p className="text-nowrap font-light">{match}</p>
                </div>
                <div className="flex h-fit">
                    {/* <button className="mr-4 flex items-center p-1 2xl:p-2 rounded-xl"><span className="w-6 h-6 2xl:w-7 2xl:h-7 icon-[lucide--ticket-plus]"/></button> */}
                    <button className="bg-primary-dark/75 flex items-center p-1 2xl:p-2 rounded-xl text-Error" onClick={e=>nowYouDont(['place','placeMobile'])}><span className="w-6 h-6 2xl:w-7 2xl:h-7 icon-[material-symbols-light--close]"/></button>
                </div>
            </div>
            <div className="mb-4">
                <Input value={amount} setValue={setAmount} placeholder={'Enter Stake'} type={'number'} name={'Stake (KES)'}/>
                <p className="my-3">Possible Win: <span ref={awardRef} className="font-bold text-Success"></span></p>
                <div className="flex justify-between">
                    <p className="flex-grow border-r-[1px] border-Grey">Total Stakes: <span className="font-bold">KSH {stakes.toLocaleString()}</span></p>
                    <p className="flex-grow text-right">Users: <span className="font-bold"> {users.toLocaleString()}</span></p>
                </div>
            </div>
            {
                isLogged?
                <button onClick={e=>place(e)} className="w-full bg-primary-light font-semibold py-2 rounded-md">Place Bet</button>
                :
                <button onClick={e=>overlayE('/login')} className="w-full bg-primary-light font-semibold py-2 rounded-md">Login to Stake</button>
            }
        </div>
    )
}