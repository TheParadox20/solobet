'use client'
import { useState, useEffect } from "react";
import { createContext } from "react";
import useSWR from "swr";
import { useAccount } from 'wagmi'
import { fetcher } from "./data";
import Spinner from "@/app/UI/body/Spinner";
import { save, load } from "./storage";

export let Context = createContext();

let settings = load('settings') || {
    currency:{
        name:'Kenyan Shilling',
        symbol: 'KSH',
        rate: 1
    },
    defaultStake: 20
}

export default function ContextProvider({ children }) {
    const account = useAccount()
    let [isLogged, setIsLogged] = useState(account.status==='connected');
    let Settings = useState(settings)
    const BaseRate = 335855;
    let { data, error, isLoading } = useSWR(['/menu',{}], fetcher,{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,
        errorRetryInterval: 15000
    });

    useEffect(()=>{
        if(isLogged){
            save('settings', Settings[0])
        }
    },[Settings[0]])

    if(isLoading) return <Spinner full={true}/>
    let Popular;
    let Sports;
    if(error){
        Popular = []
        Sports = []
    }else{
        Popular = data.Popular
        Sports = data.Sports
    }
    return(
        <Context.Provider value={{Popular, Sports, isLogged, setIsLogged, Settings, BaseRate}}>
        {children}
        </Context.Provider>
    )
}