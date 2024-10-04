import { useConnect } from 'wagmi'

export default function Wallets(){
    const { connectors, connect, status, error } = useConnect()

    let getIcon = (wallet)=>{
        switch (wallet) {
            case 'Coinbase Wallet':
                return <img className='w-10 h-10 rounded-full' src="/icons/coinbase.png" alt="" />
            case 'MetaMask':
                return <img className='w-10 h-10 rounded-full' src="/icons/phantom.png" alt="" />
            case 'Phantom':
                return <div className='icon-[logos--metamask-icon] w-10 h-10'/>
            default:
                return <div className='icon-[logos--metamask-icon] w-10 h-10'/>
        }
    }

    console.log(error?.message)
    console.log(status)

    return(
        <div className="bg-primary-base p-4 rounded-lg flex flex-col gap-1">
            <p className="my-2 text-lg font-semibold">Connect Wallet</p>
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