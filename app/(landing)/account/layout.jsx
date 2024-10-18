'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountLayout({children}) {
  let path = usePathname();
  return (
    <div className="border-t-[1px] border-Grey py-8">
      <div className="md:w-1/2 md:mx-auto px-2">
        <h1 className="text-3xl font-bold mb-3">Account</h1>
        <p className="mb-3 text-sm">Manage your account details and settings</p>
        <div className="flex text-sm gap-4 md:gap-6 py-2 md:text-lg font-semibold mb-5 text-nowrap overflow-x-auto max-w-[100vh]">
          <Link className={`whitespace-nowrap ${path=='/account'?'text-primary-light underline':null}`} href={'/account'}>Personal Details</Link>
          <Link className={`whitespace-nowrap ${path=='/account/statement'?'text-primary-light underline':null}`} href={'/account/statement'}>Statement</Link>
          <Link className={`whitespace-nowrap ${path=='/account/settings'?'text-primary-light underline':null}`} href={'/account/settings'}>Settings</Link>
          <Link className={`whitespace-nowrap ${path=='/account/responsible-gaming'?'text-primary-light underline':null}`} href={'/account/responsible-gaming'}>Responsible Gaming</Link>
        </div>
        {children}
      </div>
    </div>
  );
}