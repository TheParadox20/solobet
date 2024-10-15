'use client'
import Link from "next/link"
export default function Logo(){
    return <Link className="flex items-center gap-2" href={'/'}>
        {/* <img src="/loogo.png" className="w-7 h-7" alt="" /> */}
        <h3 className="font-semibold text-3xl">solobet</h3>
        </Link>
}