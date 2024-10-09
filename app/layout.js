import {  Montserrat } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { headers } from 'next/headers'
import ContextProvider from "@/app/lib/ContextProvider";
import { Providers } from "@/app/lib/providers";
import { cookieToInitialState } from 'wagmi'
import { config } from '@/app/lib/wagmi'
import Footer from "@/app/UI/body/Footer";
import Popup from "@/app/UI/body/Popup";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Solobet",
  description: "Kenya\'s first peer-to-peer(P2P) betting platform",
};

export default function RootLayout({ children }) {
  const initialState = cookieToInitialState(
    config,
    headers().get('cookie'),
  )

  return (
    <html lang="en" className="large-scroll">
      <Suspense>
        <body className={`${montserrat.className} bg-primary-dark text-LightGray lg:text-xs 2xl:text-base`}>
          <Providers initialState={initialState}>
            <ContextProvider>
                {children}
            </ContextProvider>
          </Providers>
          <Footer/>
          <Popup/>
        </body>
      </Suspense>
    </html>
  );
}
