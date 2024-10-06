'use client'
import useSWR from "swr";
import { useState } from "react";
import { fetcher, getData } from "@/app/lib/data";
import { useAccount } from 'wagmi'
import { popupE } from "@/app/lib/trigger";
import { useSignMessage, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/app/lib/wagmi";
import { parseEther } from "ethers";
import Input from "../UI/Input";
import ConnectWallet from "@/app/UI/body/ConnectWallet";
// import Signer from "./Signer";

export default function Page() {
  let {signMessage, error:signError} = useSignMessage({config})
  const { sendTransaction, hash, error:txError, isPending, data:signature, status:sigStatus } = useSendTransaction({
    config,
  })
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
    hash, 
  }) 
  let [amount, setAmount] = useState(0.000001)
  let [to, setTo] = useState('');
  let { data, error, isLoading } = useSWR(['/test/books',{}], fetcher);
  let message = ' sign hello world'
  const account = useAccount()
 
  // if (error){
  //   console.log(error)
  //   return <div>failed to load</div>
  // }
  if (isLoading) return <div>loading...</div>
  return (
    <div>
        <div className="flex">
          <h1>Workbench</h1>
          <div className="icon-[token--bets] w-8 h-8 text-green-500"/>
        </div>
        {/* {
          data.map((book) => (
            <div key={book.id}>
              <h2>{book.name}</h2>
              <p>{book.author}</p>
            </div>
          ))
        } */}
        <h4>Buttons</h4>
        <button className="block my-2 bg-primary-light py-1 px-4 hover:scale-105" onClick={e=>popupE('Error','New notification received')}>Popup</button>
        <button className="block my-2 bg-primary-light py-1 px-4 hover:scale-105" onClick={
          e=>signMessage(
            {account:account.address,message:message},
          )
        }>
          Sign message
        </button>
        <div className="flex flex-col">
          <span>{message}</span>
          {signError && <span>{signError.message}</span>}
          {true && <span>{signature}</span>}
          {sigStatus && <span>{sigStatus}</span>}
        </div>
        <div className="w-1/3 my-5">
          <ConnectWallet className="flex items-center justify-center gap-4 py-2 text-sm font-semibold border-2 border-primary-light rounded-lg w-full hover:shadow-md hover:shadow-primary-light">
              <span className="w-6 h-6 icon-[hugeicons--bitcoin-wallet]"/> Connect Crypto Wallet
          </ConnectWallet>
        </div>
        <button className="block my-2 bg-primary-light py-1 px-4 hover:scale-105 disabled:bg-gray-700" disabled={isPending} onClick={e=>{
          sendTransaction({
            to: to,
            value: parseEther(amount),
          });
          console.log('send clicked')
        }}>
          {isPending ? 'Pending' : 'Send transaction'}
        </button>
        <div className="w-1/3 space-y-4">
          <Input name={'address'} value={to} setValue={setTo} placeholder={'0x....'} type={'text'} />
          <Input name={'amount'} value={amount} setValue={setAmount} placeholder={'Amount ETH'} type={'number'} />
        </div>
        {hash && <div>Transaction Hash: {hash}</div>} 
        {isConfirming && <div>Waiting for confirmation...</div>} 
        {isConfirmed && <div>Transaction confirmed.</div>} 
        {txError && (
          <div>Error: {(txError).shortMessage || txError.message}</div>
        )}
    </div>
  );
}