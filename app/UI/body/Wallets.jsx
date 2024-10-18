import { useRef, useContext } from 'react'
import { Context } from '@/app/lib/ContextProvider'
import { useConnect, useSignMessage, useAccount, useDisconnect, useSwitchChain } from 'wagmi'
import useUser from '@/app/lib/hooks/useUser'
import { getData } from '@/app/lib/data'
import { config } from '@/app/lib/wagmi'
import { popupE, overlayE } from '@/app/lib/trigger'
import { baseSepolia, base, mainnet } from 'wagmi/chains';

export default function Wallets({control}){
    let {login, signUp} = useUser();
    let {isLogged} = useContext(Context)
    const account = useAccount()
    const { disconnect } = useDisconnect()
    const { chains, switchChain, isSuccess, error:switchError } = useSwitchChain({config})

    let {signMessage, error:signError, data:signature, status:signStatus } = useSignMessage({
        config,
        mutation:{
            onSuccess:(data)=>{
                if(existingRef.current){//login
                    login(account.address,data,(_)=>{
                        switchChain({
                            chainId: baseSepolia.id,
                            onSuccess:()=>{console.log('Switched to ',baseSepolia.name)},
                            onSettled:()=>{console.log('Settled to ',baseSepolia.name)},  
                        })
                        control('')
                    })
                }else{//signup
                    signUp(
                        account.address,
                        account.address,
                        data,
                        (_)=>{
                            switchChain({
                                chainId: baseSepolia.id,
                                onSuccess:()=>{console.log('Switched to ',baseSepolia.name)},
                                onSettled:()=>{console.log('Settled to ',baseSepolia.name)},  
                            })
                            control('')
                    })
                }
            },
            onError:(error)=>{
                popupE('Error',`Error when signing message: ${error}`)
            }
        }
    })

    let existingRef = useRef(null);

    let connectWalletSuccess = (_)=>{
        if(isLogged){
            getData((_)=>{},'/web3/connect',{wallet:account.address})
        }
        else
        getData((response)=>{
            existingRef.current = response.active;
            signMessage({account:account.address,message:'solobet.vercel.app'})
        },'/web3/check',{wallet:account.address})
    }

    const { connectors, connect, status, error } = useConnect({
        config,
        mutation:{
            onSuccess:(_)=>{connectWalletSuccess(_)},
            onError:(error)=>{
                popupE('Error',`Wallet connection error: ${error.message}`);
                disconnect();
            }
        }
    })

    let getIcon = (wallet)=>{
        switch (wallet) {
            case 'Coinbase Wallet':
                return <img className='w-10 h-10 rounded-full' src="/icons/coinbase.png" alt="" />
            case 'Phantom':
                return <img className='w-10 h-10 rounded-full' src="/icons/phantom.png" alt="" />
            case 'MetaMask':
                return <div className='icon-[logos--metamask-icon] w-10 h-10'/>
            default:
                return <div className='icon-[logos--metamask-icon] w-10 h-10'/>
        }
    }

    return(
        <div className="bg-primary-base p-4 rounded-lg flex flex-col gap-1">
            <div className="my-3 flex justify-between items-center gap-12">
                <p className="text-lg font-semibold">Connect Wallet</p>
                <button className="w-7 h-7 icon-[lets-icons--back]" onClick={e=>control('')}/>
            </div>
            {
                connectors.map((connector) => (
                <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    className='flex items-center gap-3 my-2'
                >
                    {getIcon(connector.name)}
                    <div className='text-left'>{connector.name}</div>
                </button>
                ))
            }
        </div>
    )
}