import { derived } from 'svelte/store';
import { connect, watchAccount, getWalletClient, watchNetwork, fetchBalance } from '@wagmi/core';
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
 * @property {number | undefined} chainId
 * @property {bigint} balance
 */

/** @type {AccountStoreState} */
const initialValue = {
	isConnected: false,
	address: undefined,
	shortAddress: '',
	chainId: undefined,
	balance: 0n
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

		let state = initialValue;

		const unwatchAccount = watchAccount(async (account) => {
			if (!account.address) return;
			state = {
				...state,
				address: getAddress(account.address),
				isConnected: account.isConnected,
				shortAddress: truncateEthAddress(account.address || '')
			};
			console.log(state);
			set(state);
			fetchBalance({ address: account.address }).then((balanceResult) => {
				state = {
					...state,
					balance: balanceResult.value
				};
				console.log(state);
				set(state);
			});
		});

		const unwatchNetwork = watchNetwork(async (network) => {
			if (!network) return;
			state = {
				...state,
				chainId: network.chain?.id
			};
			console.log(state);
			set(state);
		});

		return () => {
			unwatchAccount();
			unwatchNetwork();
		};
	},
	initialValue
);
