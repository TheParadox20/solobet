'use client'
import { useEffect } from "react";
import { SportsMenu, MobileSportsMenu } from "@/app/UI/body/Menus";
import Betslip from "@/app/UI/games/Betslip";
import Place from "@/app/UI/games/Place";

export default function GamesLayout({children}){
    useEffect(()=>{
        let listing = document.getElementById('sport-listing');
        listing.addEventListener("scroll",(e)=>{
            // console.log(e)
            console.log('Scroll Top :: ',listing.scrollTop)
            console.log('Scroll Height :: ',listing.scrollHeight)
            console.log('Scroll Client :: ',listing.clientHeight)
        })
    },[])
    return (
        <div className="flex flex-col md:flex-row border-t-[1px] py-3 md:py-8 border-Grey">
            <MobileSportsMenu/>
            <div className="w-1/6">
                <SportsMenu/>
            </div>
            <div id="sport-listing" className="mx-auto w-full px-2 md:pr-2 md:w-1/2 md:overflow-y-scroll md:max-h-[100vh] large-scroll">
                {children}
            </div>
            <div className="hidden md:block w-1/4 mx-auto rounded-full">
                <div id="place" className="hidden mb-4 mx-auto bg-primary-base rounded-lg"><Place/></div>
                <Betslip/>
            </div>
        </div>
    )
}