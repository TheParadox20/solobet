'use client'
import useSWR from "swr";
import { fetcher } from "@/app/lib/data";
import Spinner from "@/app/UI/body/Spinner";
import Prediction from "@/app/UI/games/Prediction";
import Gamers from "@/app/UI/games/Gamers";
import Casino from "@/app/UI/games/Casino";

export default function P2E() {
  let { data, error, isLoading, mutate } = useSWR(['/p2e',{}], fetcher);
  let prediction = {
    thumbnail: 'https://via.placeholder.com/150',
    title:'Presidential Election Winner',
    stakes:12740,
    options:[
      {name:'Joe Biden', percentage:12},
      {name:'Donald Trump', percentage:15},
      {name:'Kanye West', percentage:20}
    ],
    chats:324
  }
  let game = {
    thumbnail: 'https://via.placeholder.com/150',
    title:'Call of Duty: Warzone',
    devices:'Xbox/PS Tournament',
    fee:200,
    seats:7,
    prizes:2000,
    start:'Sat 12 Jun, 02:30 pm',
  }
  let casino = {}

  return(
    <main>
      <div className="flex gap-3 mb-3 items-center">
        <span className="w-5 h-5 icon-[bi--graph-up]"/>
        <h6 className="font-semibold text-lg">Prediction Market</h6>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {
          isLoading || error?
          <div className="flex justify-center w-full h-[20vh]"><Spinner full={false}/></div>
          :
          // data && data.predictions.map((prediction,i)=>{
            [...new Array(6)].map((_,i)=>{
            return <div key={i} className=""><Prediction data={prediction}/></div>
          })
        }
      </div>
      <button className="flex text-lg items-center gap-x-2 bg-primary-light justify-center font-semibold py-3 rounded-lg w-full my-10">
        <span>View All</span>
        <span className="w-7 h-7 icon-[ep--right]"/>
      </button>

      <div className="flex gap-3 mb-3 items-center">
        <span className="w-5 h-5 icon-[solar--gamepad-charge-linear]"/>
        <h6 className="font-semibold text-lg">Gamers{"\'"} Lounge</h6>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7">
        {
          isLoading || error?
          <div className="flex justify-center w-full h-[20vh]"><Spinner full={false}/></div>
          :
          // data && data.games.map((game,i)=>{
            [...new Array(6)].map((_,i)=>{
            return <div key={i} className=""><Gamers data={game}/></div>
          })
        }
      </div>
      <button className="flex text-lg items-center gap-x-2 bg-primary-light justify-center font-semibold py-3 rounded-lg w-full my-10">
        <span>View All</span>
        <span className="w-7 h-7 icon-[ep--right]"/>
      </button>

      <div className="flex gap-5">
        <span className="w-5 h-5 icon-[game-icons--fire-ace]"/>
        <h6 className="font-semibold">Casino</h6>
      </div>
      <div className="h-[20vh] flex items-center">
        <p className="text-center text-lg">Coming soon</p>
      </div>
    </main>
  )
}