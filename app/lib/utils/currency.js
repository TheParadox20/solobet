import { formatEther } from "ethers";

let KshEthRate = 314992;
let USDEthRate = 2611;
export function WeiKsh(wei){return parseFloat(formatEther(wei))*KshEthRate}
export function EthKsh(eth){return eth*KshEthRate}
export function KshEth(ksh){return (ksh/KshEthRate).toFixed(18).toString()}
export function USDEth(usd){return (usd/USDEthRate).toFixed(18).toString()}
export function EthUSD(eth){return eth*USDEthRate}
export function EthFloat(eth){}