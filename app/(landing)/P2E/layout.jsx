'use client'
import Link from "next/link";
import { SportsMenu } from "@/app/UI/body/Menus";
import Breadcrumb from "@/app/UI/games/Breadcrumb";
import { usePathname} from "next/navigation";

export default function P2ELayout({children}){
    let path = usePathname().replaceAll('%20',' ');
    path = path.split('/')
    return(
        <main className="flex flex-col md:flex-row border-t-[1px] py-3 md:py-8 border-Grey">
            <div className="w-1/6">
                <SportsMenu/>
            </div>
            <div className="md:overflow-y-scroll md:max-h-[100vh] large-scroll mx-1 md:mx-6 md:px-4 w-full">
                <Breadcrumb path={path} />
                <h1 className="font-bold text-2xl 2xl:text-3xl my-5">Play To Earn</h1>
                <div className="flex flex-col gap-y-3 md:flex-row md:items-center md:justify-between mb-7">
                    <div>
                        <Link className={`text-lg font-semibold mr-4 2xl:mr-6 ${true?'text-primary-light':''}`} href={'/P2E'}>All Events</Link>
                        <Link className={`text-lg font-semibold mr-4 2xl:mr-6 ${false?'':''}`} href={'/P2E/created'}>My Events</Link>
                    </div>
                    <button className="rounded-md w-56 self-end mr-2 md:mr-0 font-semibold py-2 block text-center border-2 border-primary-light">Create New Event</button>
                </div>
                {children}
            </div>
        </main>
    )
}