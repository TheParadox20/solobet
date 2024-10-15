import { useEffect, useContext } from "react";
import { useAccount, useDisconnect, useBalance } from 'wagmi'
import { baseSepolia } from 'wagmi/chains';
import { ethers } from "ethers";
import { Context } from "@/app/lib/ContextProvider";
import useSWR from "swr";
import { fetcher, postData } from "@/app/lib/data";
import { save, load, remove } from "@/app/lib/storage";
import { config } from '@/app/lib/wagmi'

export default function useUser () {
    let {setIsLogged, isLogged} = useContext(Context);
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

    let logout = ()=>{
        remove('token');
        disconnect();
        setIsLogged(false)
    }

    let login = (phone, password,worker)=>{
        postData((response)=>{
            save('token',response.token)
            if(response.token){
                mutate({
                    name: response.name,
                    phone: response.phone,
                    balance: parseFloat((account.status==='connected' && balance?.isFetched)? ethers.formatUnits(balance?.data?.value, 'ether') :response.balance)  *  (balance?.isFetched ? 314992 : 1),
                    web3: account.status==='connected'
                })
                setIsLogged(true)
            }
            worker(response)
        },{phone,password},'/signin')
    }

    let signUp = (name, phone, password, worker)=>{
        postData((response)=>{
            save('token',response.token)
            if(response.token){
                mutate({
                    name: response.name,
                    phone: response.phone,
                    balance: parseFloat((account.status==='connected' && balance?.isFetched)? ethers.formatUnits(balance?.data?.value, 'ether') :response.balance)  *  (balance?.isFetched ? 314992 : 1),
                    web3: account.status==='connected'
                })
                setIsLogged(true)
            }
            worker(response)
        },{name,phone,password},'/signup')
    }

    let updateBalance = (amount)=>{
        mutate({
            ...data,
            balance: data.balance + amount
        })
    }

    useEffect(()=>{
        if(!isLoading && !isError) if(data?.name){
            setIsLogged(true)
            mutate({
                name: data.name,
                phone: data.phone,
                balance: parseFloat(data.balance)
            })
        }
    },[data])

    return {
        user: (isLoading || isError)?{}:data,
        isLoading,
        isError,
        login,
        signUp,
        logout,
        updateBalance
    }
}