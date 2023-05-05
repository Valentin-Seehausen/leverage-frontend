import { derived, writable } from 'svelte/store';
import { connect, watchAccount, disconnect, fetchSigner } from '@wagmi/core';
import truncateEthAddress from 'truncate-eth-address';
import { isInitialized } from './client';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';

// import { metaMaskConnector } from './client';
export const metaMaskConnector = new MetaMaskConnector({
	options: { shimDisconnect: true }
});

export const connectWallet = async () => {
	if (await fetchSigner()) return;
	connect({
		connector: metaMaskConnector
	});
};

function createWallet() {
	const { subscribe, set } = writable({
		isConnected: false,
		address: '',
		shortAddress: ''
	});

	return {
		subscribe,
		connect: async () => {
			const result = await connect({
				connector: metaMaskConnector
			});

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

// export const walletStore = derived(isInitialized, ($isInitialized, set) => {
// 	if ($isInitialized) {
// 		set(createWallet());
// 	}
// });

export const wallet = createWallet();

export const account = derived(
	isInitialized,
	($isInitialized, set) => {
		if (!$isInitialized) return;

		const unwatch = watchAccount(async (account) => {
			set({
				address: account.address || '',
				isConnected: account.isConnected,
				shortAddress: truncateEthAddress(account.address || '')
			});
		});

		return () => unwatch();
	},
	{
		isConnected: false,
		address: '',
		shortAddress: ''
	}
);

// watchAccount(async (account) => {
// 	wallet.set({
// 		address: account.address || '',
// 		isConnected: account.isConnected,
// 		shortAddress: truncateEthAddress(account.address || '')
// 	});
// });
