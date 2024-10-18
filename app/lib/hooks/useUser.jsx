import { useEffect, useContext, useCallback } from "react";
import { useAccount, useDisconnect, useBalance } from 'wagmi'
import { baseSepolia } from 'wagmi/chains';
import { ethers } from "ethers";
import { Context } from "@/app/lib/ContextProvider";
import useSWR from "swr";
import { fetcher, postData } from "@/app/lib/data";
import { save, remove } from "@/app/lib/storage";
import { config } from '@/app/lib/wagmi'
import {formatAddress} from "@/app/lib/utils/utils";

export default function useUser () {
    let {setIsLogged, BaseRate, Settings} = useContext(Context);
    let [settings, setSettings] = Settings
    const account = useAccount()
    const balance = useBalance({
        address: account.address,
        blockTag:'latest',
        unit:'ether',
        config: config,
        chainId: baseSepolia.id
    })
    const { disconnect } = useDisconnect()
    const { data, isError, isLoading, mutate } = useSWR(['/user',{}], fetcher, {
        // revalidateOnFocus: false,
        // revalidateOnReconnect: false,
        // revalidateOnMount: false,
        // errorRetryInterval: 15000
    })

    let logout = useCallback(() => {
        remove('token');
        disconnect();
        setIsLogged(false)
        if(typeof window !== 'undefined') window.location.reload()
    }, [disconnect, setIsLogged]);

    let getBalance = useCallback((offChainBalance) => {
        if(offChainBalance && account.status !== 'connected') return parseFloat(offChainBalance) * settings.currency.rate
        if(account.status === 'connected' && balance?.isFetched && !balance?.isError) return parseFloat(ethers.formatUnits(balance?.data?.value, 'ether')) * BaseRate * settings.currency.rate
        if(balance?.isFetching || balance?.isError) return undefined
    }, [account.status, balance]);

    let login = useCallback((phone, password, worker) => {
        postData((response) => {
            save('token', response.token)
            if(response.token){
                mutate({
                    name: response.web3?formatAddress(response.name):response.name,
                    phone: response.web3?formatAddress(response.phone):response.phone,
                    balance: getBalance(response.balance),
                    web3: account.status === 'connected'
                }, false)
                setIsLogged(true)
            }
            worker(response)
        }, {phone, password}, '/signin')
    }, [getBalance, mutate, setIsLogged, account.status]);

    let signUp = useCallback((name, phone, password, worker) => {
        postData((response) => {
            save('token', response.token)
            if(response.token){
                mutate({
                    name: response.web3?formatAddress(response.name):response.name,
                    phone: response.web3?formatAddress(response.phone):response.phone,
                    balance: getBalance(response.balance),
                    web3: account.status === 'connected'
                }, false)
                setIsLogged(true)
            }
            worker(response)
        }, {name, phone, password}, '/signup')
    }, [getBalance, mutate, setIsLogged, account.status]);

    let updateBalance = useCallback((amount) => {
        mutate({
            ...data,
            balance: data.balance + amount
        }, false)
    }, [data, mutate]);

    useEffect(() => {
        if(!isLoading && !isError && data?.name){
            setIsLogged(true)
            mutate({
                name: data.web3?formatAddress(data.name):data.name,
                phone: data.web3?formatAddress(data.phone):data.phone,
                balance: getBalance(data.balance),
            }, false)
        }
    }, [data, isLoading, isError, getBalance, mutate, setIsLogged]);

    useEffect(() => {
        if(balance?.isFetched && account.status === 'connected' && data?.balance == undefined){
            mutate({
                ...data,
                balance: getBalance(balance)
            }, false)
        }
    }, [balance, account.status, data, getBalance, mutate]);

    return {
        user: (isLoading || isError) ? {} : data,
        isLoading,
        isError,
        login,
        signUp,
        logout,
        updateBalance
    }
}