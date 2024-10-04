import { useEffect, useContext } from "react";
import { useAccount, useDisconnect } from 'wagmi'
import { Context } from "@/app/lib/ContextProvider";
import useSWR from "swr";
import { fetcher, postData } from "@/app/lib/data";
import { save, load, remove } from "@/app/lib/storage";

export default function useUser () {
    let {setIsLogged} = useContext(Context);
    const account = useAccount()
    const { disconnect } = useDisconnect()
    const { data, isError, isLoading, mutate } = useSWR(['/user',{}], fetcher)

    let logout = ()=>{
        remove('token');
        disconnect();
        setIsLogged(false)
    }

    if(account.status === 'connected'){
        mutate({
            name: account.addresses,
            phone: 0,
            balance: parseFloat(0),
            web3:true,
            chain:account.chainId
        })
        setIsLogged(true)
    }

    let login = (phone, password,worker)=>{
        postData((response)=>{
            save('token',response.token)
            if(response.token){
                mutate({
                    name: response.name,
                    phone: response.phone,
                    balance: parseFloat(response.balance)
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
                    balance: parseFloat(response.balance)
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