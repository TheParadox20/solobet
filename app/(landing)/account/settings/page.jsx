'use client'
import { useState, useContext } from "react";
import { Context } from "@/app/lib/ContextProvider";
import Input from "@/app/UI/Input";

export default function Page() {
  let {Settings} = useContext(Context)
  let [settings, setSettings] = Settings
  let [stake, setStake] = useState(settings.defaultStake)
  const currencries = [
    {
      name: 'Kenyan Shilling',
      symbol: 'Ksh',
      rate: 1 // KSH/n
    },
    {
      name: 'Nigerian Naira',
      symbol: 'NGN',
      rate: 12.67
    },
    {
      name: 'US Dollar',
      symbol: 'USD',
      rate: 0.0078
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      rate: 0.0000030
    }
  ]

  return (
    <main className="">
        <div className="flex gap-5 items-center my-10">
          <p className="font-semibold text-xl">Change Currency</p>
          <div className="flex gap-6">
            <p>{settings.currency.symbol} <span className="text-xs text-gray-400">current</span></p>
            <select onChange={(e)=>setSettings({...settings, currency:currencries[e.target.value]})}>
              {currencries.map((currency, index)=><option key={index} value={index}>{currency.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-5 items-center my-10">
          <p className="font-semibold text-xl">Change Default Stake</p>
          <div className="flex items-center gap-6">
            <p>{settings.defaultStake} <span className="text-xs text-gray-400">current</span></p>
            <div className="flex items-center gap-3">
              <button className="px-3 text-lg bg-gray-700 rounded-sm" onClick={()=>setStake(stake+=10)}>+</button>
              <Input name={'stake'} value={stake} setValue={setStake} placeholder={'Amount'} type={'number'} />
              <button className="px-3 text-lg bg-gray-700 rounded-sm" onClick={()=>setStake(stake-=10)}>-</button>
            </div>
            <button 
              disabled={stake==settings.defaultStake}
              className="bg-primary-light px-4 py-2 rounded-lg disabled:bg-gray-800 hover:scale-105"
              onClick={()=>setSettings({...settings, defaultStake:stake})}
            >
              Modify
            </button>
          </div>
        </div>
    </main>
  );
}