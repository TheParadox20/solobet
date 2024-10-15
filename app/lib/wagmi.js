import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { baseSepolia, base, mainnet } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [baseSepolia, base, mainnet],
  connectors: [
    coinbaseWallet({ appName: 'solobet wallet', preference: 'smartWalletOnly' }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});
