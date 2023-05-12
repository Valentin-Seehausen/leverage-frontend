import { derived } from 'svelte/store';
import { connect, watchAccount, getWalletClient } from '@wagmi/core';
import truncateEthAddress from 'truncate-eth-address';
import { isInitialized } from './client';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { getAddress } from 'viem';

export const metaMaskConnector = new MetaMaskConnector({
	options: { shimDisconnect: true }
});

/**
 * @typedef {Object} AccountStoreState
 * @property {boolean} isConnected
 * @property {import('viem').Address | undefined} address
 * @property {string} shortAddress
 */

/** @type {AccountStoreState} */
const initialValue = {
	isConnected: false,
	address: undefined,
	shortAddress: ''
};

export const connectWallet = async () => {
	if (await getWalletClient()) return;
	connect({
		connector: metaMaskConnector
	});
};

export const account = derived(
	isInitialized,
	($isInitialized, set) => {
		if (!$isInitialized) return;

		const unwatch = watchAccount(async (account) => {
			if (!account.address) return;
			set({
				address: getAddress(account.address),
				isConnected: account.isConnected,
				shortAddress: truncateEthAddress(account.address || '')
			});
		});

		return () => unwatch();
	},
	initialValue
);
