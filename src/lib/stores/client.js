import { configureChains, createClient } from '@wagmi/core';
import { arbitrumGoerli } from '@wagmi/core/chains';
import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { publicProvider } from '@wagmi/core/providers/public';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { ALCHEMY_ARBITRUM_GOERLI_KEY } from '$lib/config/keys.json';
import { readable } from 'svelte/store';

export const isInitialized = readable(false, (set) => {
	connectClient();
	set(true);
});

const metaMaskConnector = new MetaMaskConnector({
	options: { shimDisconnect: true }
});

const connectClient = () => {
	const { provider, webSocketProvider } = configureChains(
		[arbitrumGoerli],
		[
			alchemyProvider({ apiKey: ALCHEMY_ARBITRUM_GOERLI_KEY, priority: 0 }),
			publicProvider({ priority: 1 })
		]
	);

	const client = createClient({
		autoConnect: true,
		provider,
		webSocketProvider,
		connectors: [metaMaskConnector]
	});

	return client;
};
