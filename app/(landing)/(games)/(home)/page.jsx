'use client'
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/app/lib/data";
import Spinner from "@/app/UI/body/Spinner";
import Carousel from "@/app/UI/body/Hero";
import Game from "@/app/UI/games/Game";
import Prediction from "@/app/UI/games/Prediction";
import SportIcon from "@/app/UI/SportsIcon";

export default function Page() {
  let { data, error, isLoading } = useSWR(['/home',{}], fetcher);
  
  return (
    <div className="lg:mt-7">
        <Carousel/>
        <div className="flex gap-3 mb-4 items-center">
          <span className="w-5 h-5 icon-[bi--graph-up]"/>
          <h6 className="font-semibold text-lg">Prediction Market</h6>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-8">
          {
            isLoading || error?
            <div className="flex justify-center w-full h-[20vh]"><Spinner full={false}/></div>
            :
            data && data.p2e.map((prediction,i)=>{
              return <div key={i} className=""><Prediction data={prediction}/></div>
            })
          }
        </div>
        <button className="flex text-lg items-center gap-x-2 bg-primary-light justify-center font-semibold py-3 rounded-lg w-full my-10">
          <span>View All</span>
          <span className="w-7 h-7 icon-[ep--right]"/>
        </button>
        {
          error && <p>Error fetching games</p>
        }
        {
          isLoading?
          <Spinner full={false}/>
          :
          !error && Object.keys(data.popular).map((sport,i)=>{
            return (
              <div key={i}>
                <div className="flex items-center font-bold text-lg gap-2 2xl:text-2xl mb-4"><SportIcon sport={sport} classname={'w-7 h-7'}/>Upcoming {sport}</div>
                <div className="bg-primary-base mb-8 px-5 md:px-8 pb-10 pt-2 rounded-lg">
                  {
                    data.popular[sport].map((match,i)=>(<div key={i} className="my-4"><Game data={match}/></div>))
                  }
                  <Link href={`/sports?sport=${sport}`} className="w-full flex items-center justify-center text-center font-semibold underline underline-offset-4">View All Upcoming {sport} <span className="icon-[basil--arrow-right-outline] w-7 h-7"/></Link>
                </div>
              </div>
            )
          })
        }
    </div>
  );
}