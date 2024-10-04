import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({ appName: 'Create Wagmi', preference: 'smartWalletOnly' }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});
