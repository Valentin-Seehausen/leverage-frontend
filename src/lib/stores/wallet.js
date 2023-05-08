import { derived } from 'svelte/store';
import { connect, watchAccount, fetchSigner } from '@wagmi/core';
import truncateEthAddress from 'truncate-eth-address';
import { isInitialized } from './client';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';

export const metaMaskConnector = new MetaMaskConnector({
	options: { shimDisconnect: true }
});

export const connectWallet = async () => {
	if (await fetchSigner()) return;
	connect({
		connector: metaMaskConnector
	});
};

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
