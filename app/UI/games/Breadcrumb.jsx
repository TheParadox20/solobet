'use client'
import Link from "next/link";

export default function Breadcrumb({path}){
    console.log(path)
    return(
        <p className="mb-3">
            <Link href={'/'}>Home</Link>
            {
                path.includes('P2E')?
                <Link className="ml-2" href={'/P2E'}>/ <span className="ml-2">Play To Earn</span></Link>
                :
                <Link className="ml-2" href={'/sports'}>/ <span className="ml-2">Sports</span></Link>
            }
            {
                path.slice(1,).map((item,i)=>{
                    return (<Link key={i} href={`/${path.slice(0,i+2).join('/')}`} className="ml-2"> / <span className="text-primary-light ml-2">{item}</span></Link>)
                })
            }
        </p>
    )
}