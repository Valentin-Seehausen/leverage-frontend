import { configureChains, createClient } from '@wagmi/core';
import { sepolia } from '@wagmi/core/chains';
import { infuraProvider } from '@wagmi/core/providers/infura';
import { publicProvider } from '@wagmi/core/providers/public';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { INFURA_API_KEY } from '$lib/config/keys.json';
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
		[sepolia],
		[infuraProvider({ apiKey: INFURA_API_KEY, priority: 0 }), publicProvider({ priority: 1 })]
	);

	const client = createClient({
		autoConnect: true,
		provider,
		webSocketProvider,
		connectors: [metaMaskConnector]
	});

	return client;
};
