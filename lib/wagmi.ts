import { createConfig } from 'wagmi';
import { http } from 'viem';
import { mainnet } from 'viem/chains';

export const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
}); 