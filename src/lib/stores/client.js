import { configureChains, createConfig } from '@wagmi/core';
import { arbitrumGoerli } from '@wagmi/core/chains';
import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { publicProvider } from '@wagmi/core/providers/public';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { ALCHEMY_ARBITRUM_GOERLI_KEY } from '$lib/config/keys.json';
import { readable } from 'svelte/store';

const metaMaskConnector = new MetaMaskConnector({
	options: { shimDisconnect: true }
});

export const { publicClient, webSocketPublicClient } = configureChains(
	[arbitrumGoerli],
	[alchemyProvider({ apiKey: ALCHEMY_ARBITRUM_GOERLI_KEY }), publicProvider()]
);

export const client = createConfig({
	autoConnect: true,
	publicClient,
	webSocketPublicClient,
	connectors: [metaMaskConnector]
});

export const isInitialized = readable(false, (set) => {
	set(true);
});
