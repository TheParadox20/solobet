'use client'
import useSWR from "swr";
import { useState } from "react";
import { fetcher, getData } from "@/app/lib/data";
import Spinner from "@/app/UI/body/Spinner";
import Overlay from "@/app/UI/body/Overlay";
import BetInfo from "./BetInfo";

export default function Close(){
    let [control, setControl] = useState(false);
    let [choice, setChoice] = useState(null);
    let [gameID, setGameID] = useState(null);
    let [overlay, setOverlay] = useState('');
    let { data, error, isLoading } = useSWR(['/bets/active',{}], fetcher);

    let close = (e,option, id)=>{
        e.preventDefault();
        if(option === 0) setChoice(1);
        if(option === 1) setChoice(0);
        if(option === 2) setChoice(2);
        setGameID(id);
        setOverlay('bet-info');
    }

    if(isLoading) return <Spinner/>
    if(error) return <div>Error Fetching active games</div>

    return (
        <div className="my-10">
            <h6 className="font-semibold text-lg">Close Active Bets</h6>
            {
                data.map((bet)=>{
                    return (
                        <div key={bet.id} className="flex justify-between items-center p-2 border-b border-gray-200">
                            <div>
                                <p>{bet.options[0]} vs {bet.options[1]}</p>
                                <p className="text-xs mt-2 text-gray-500">{bet.date}</p>
                            </div>
                            <div>
                                <div className="font-semibold">{bet.sport}</div>
                                <button 
                                    onClick={e=>{navigator.clipboard.writeText((bet.id).toString())}} 
                                    className="flex items-center text-sm mt-2 text-gray-500"
                                >
                                    {bet.id} 
                                    {
                                        // navigator.clipboard.readText().then((text)=>{return text==(bet.id).toString()})?
                                        false?
                                        <span className="w-5 h-5 icon-[tabler--copy-check-filled]"/>
                                        :
                                        <span className="w-5 h-5 icon-[octicon--copy-24]"/>
                                        
                                    }
                                </button>
                            </div>
                            {
                                bet.outcomes.map((outcome, i)=>{
                                    return (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="font-semibold">{outcome.name}</div>
                                            <button onClick={e=>close(e,i, bet.id)} className="bg-primary-light px-2 py-1 text-white rounded-full">Close</button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }) 
            }
            <Overlay control={setOverlay} id={'bet-info'} className={`${overlay==''?'hidden':'block'}`} >
                { gameID && <BetInfo controll={setOverlay} id={gameID} choice={choice}/>}
            </Overlay>
        </div>
    )
}