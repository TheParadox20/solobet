'use client'
import Link from "next/link";
import { SportsMenu } from "@/app/UI/body/Menus";
import Breadcrumb from "@/app/UI/games/Breadcrumb";
import { usePathname} from "next/navigation";

export default function P2ELayout({children}){
    let path = usePathname().replaceAll('%20',' ');
    path = path.split('/')
    console.log(path)
    return(
        <main className="flex flex-col md:flex-row border-t-[1px] py-3 md:py-8 border-Grey">
            <div className="w-1/6">
                <SportsMenu/>
            </div>
            <div className="md:overflow-y-scroll md:max-h-[100vh] large-scroll mx-1 md:mx-6 md:px-4 w-full">
                <Breadcrumb path={path} />
                <h1 className="font-bold text-2xl 2xl:text-3xl my-5">Play To Earn</h1>
                {children}
            </div>
        </main>
    )
}