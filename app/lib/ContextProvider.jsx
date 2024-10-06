'use client'
import { useState, useEffect } from "react";
import { createContext } from "react";
import useSWR from "swr";
import { useAccount } from 'wagmi'
import { fetcher } from "./data";
import Spinner from "@/app/UI/body/Spinner";

export let Context = createContext();

export default function ContextProvider({ children }) {
    const account = useAccount()
    let [isLogged, setIsLogged] = useState(account.status==='connected');
    let { data, error, isLoading } = useSWR(['/menu',{}], fetcher,{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,
        errorRetryInterval: 15000
    });
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
        <Context.Provider value={{Popular, Sports, isLogged, setIsLogged}}>
        {children}
        </Context.Provider>
    )
}