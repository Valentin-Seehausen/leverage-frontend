import { createConfig } from '@wagmi/core';
import { arbitrumSepolia } from '@wagmi/core/chains';
import { http } from 'viem';
import { injected } from '@wagmi/connectors';
import { ALCHEMY_ARBITRUM_SEPOLIA_RPC } from '$lib/config/keys.json';
import { readable } from 'svelte/store';

export const metaMaskConnector = injected({ target: 'metaMask' });

export const config = createConfig({
	chains: [arbitrumSepolia],
	transports: { [arbitrumSepolia.id]: http(ALCHEMY_ARBITRUM_SEPOLIA_RPC) },
	connectors: [metaMaskConnector]
});

export const isInitialized = readable(false, (set) => {
	set(true);
});
