import { derived } from 'svelte/store';
import { connect, watchAccount, getWalletClient, watchNetwork, fetchBalance } from '@wagmi/core';
import truncateEthAddress from 'truncate-eth-address';
import { isInitialized, metaMaskConnector } from './client';
import { getAddress } from 'viem';

/**
 * @typedef {Object} AccountStoreState
 * @property {boolean} isConnected
 * @property {import('viem').Address | undefined} address
 * @property {string} shortAddress
 * @property {number | undefined} chainId
 * @property {bigint} balance
 * @property {boolean} fetchingBalance
 */

/** @type {AccountStoreState} */
const initialState = {
	isConnected: false,
	address: undefined,
	shortAddress: '',
	chainId: undefined,
	balance: 0n,
	fetchingBalance: false
};

export const connectWallet = async () => {
	if (await getWalletClient()) return;
	await connect({
		connector: metaMaskConnector
	});
};

export const account = derived(
	isInitialized,
	($isInitialized, set) => {
		if (!$isInitialized) return;

		let state = initialState;

		const unwatchAccount = watchAccount(async (account) => {
			if (!account.address) {
				state = initialState;
				set(state);
				return;
			}

			localStorage.setItem('connectedBefore', 'true');

			state = {
				...state,
				address: getAddress(account.address),
				isConnected: account.isConnected,
				shortAddress: truncateEthAddress(account.address || ''),
				fetchingBalance: true
			};
			set(state);
			fetchBalance({ address: account.address }).then((balanceResult) => {
				state = {
					...state,
					balance: balanceResult.value,
					fetchingBalance: false
				};
				set(state);
			});
		});

		const unwatchNetwork = watchNetwork(async (network) => {
			if (!network) return;
			state = {
				...state,
				chainId: network.chain?.id
			};
			set(state);
		});

		return () => {
			unwatchAccount();
			unwatchNetwork();
		};
	},
	initialState
);
