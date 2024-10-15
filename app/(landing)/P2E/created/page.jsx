'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Created(){
    let path = usePathname().replaceAll('%20',' ');

    return(
        <main>
            <div className="flex flex-col gap-y-3 md:flex-row md:items-center md:justify-between mb-7">
                <div>
                    <Link className={`text-lg font-semibold mr-4 2xl:mr-6 ${!path.includes('created')?'text-primary-light':''}`} href={'/P2E'}>All Events</Link>
                    <Link className={`text-lg font-semibold mr-4 2xl:mr-6 ${path.includes('created')?'text-primary-light':''}`} href={'/P2E/created'}>My Events</Link>
                </div>
                <button className="rounded-md w-56 self-end mr-2 md:mr-0 font-semibold py-2 block text-center border-2 border-primary-light">Create New Event</button>
            </div>
            <p>Created events</p>
        </main>
    )
}