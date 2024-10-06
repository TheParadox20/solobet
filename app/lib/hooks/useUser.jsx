import { useEffect, useContext } from "react";
import { useAccount, useDisconnect } from 'wagmi'
import { Context } from "@/app/lib/ContextProvider";
import useSWR from "swr";
import { fetcher, postData } from "@/app/lib/data";
import { save, load, remove } from "@/app/lib/storage";

// 0xf12Ad0A0CaAB4D67e5531266504dFFa7a9e3Dcc7
// 0x5Ed7293FC6aFc86A7E5c54F4A320C93DA812BF02
export default function useUser () {
    let {setIsLogged} = useContext(Context);
    const account = useAccount()
    const { disconnect } = useDisconnect()
    const { data, isError, isLoading, mutate } = useSWR(['/user',{}], fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,
        errorRetryInterval: 15000
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