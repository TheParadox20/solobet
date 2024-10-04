'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { WagmiProvider } from 'wagmi'

import { config } from '@/app/lib/wagmi'

export function Providers({children,initialState}) {
  const [configuration] = useState(config)
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={configuration} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
