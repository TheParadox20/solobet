import { overlayE } from "@/app/lib/trigger"

export default function ConnectWallet({children, className}){
    return <button onClick={e=>overlayE('/wallets')} className={className}>{children}</button>
}