import { writable } from 'svelte/store';
import { connect, watchAccount, disconnect } from '@wagmi/core';

import { configureChains, createClient } from '@wagmi/core';
import { sepolia } from '@wagmi/core/chains';
import { infuraProvider } from '@wagmi/core/providers/infura';
import { publicProvider } from '@wagmi/core/providers/public';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import truncateEthAddress from 'truncate-eth-address';

const INFURA_API_KEY = '54e0e7fc177149b79695f54e8365a056';

const { provider, webSocketProvider } = configureChains(
	[sepolia],
	[
		infuraProvider({ apiKey: INFURA_API_KEY, priority: 0, stallTimeout: 1000 }),
		publicProvider({ priority: 1 })
	]
);

const metaMaskConnector = new MetaMaskConnector({
	options: { shimDisconnect: true }
});

createClient({
	autoConnect: true,
	provider,
	webSocketProvider,
	connectors: [metaMaskConnector]
});

function createWallet() {
	const { subscribe, set } = writable({
		isConnected: false,
		address: '',
		shortAddress: ''
	});

	return {
		subscribe,
		connect: async () => {
			const result = await connect({ connector: metaMaskConnector });

			set({
				isConnected: !!result.account,
				address: result.account,
				shortAddress: truncateEthAddress(result.account)
			});
		},
		disconnect: async () => {
			await disconnect();
			set({ isConnected: false, address: '', shortAddress: '' });
		},
		set
	};
}

export const wallet = createWallet();

watchAccount(async (account) => {
	wallet.set({
		address: account.address || '',
		isConnected: account.isConnected,
		shortAddress: truncateEthAddress(account.address || '')
	});
});
