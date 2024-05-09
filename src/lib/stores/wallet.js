import { derived } from 'svelte/store';
import { connect, watchAccount } from '@wagmi/core';
import { injected } from '@wagmi/connectors';
import truncateEthAddress from 'truncate-eth-address';
import { isInitialized, config } from './client';
import { getAddress } from 'viem';
import { getBalance } from '@wagmi/core';

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
	// TODO: Replace this:
	// if (await getConnectorClient(client)) return;
	await connect(config, {
		connector: injected({ target: 'metaMask' })
	});
};

export const account = derived(
	isInitialized,
	($isInitialized, set) => {
		if (!$isInitialized) return;

		let state = initialState;

		const unwatchAccount = watchAccount(config, {
			async onChange(account) {
				if (!account.address) {
					state = initialState;
					set(state);
					return;
				}

				localStorage.setItem('connectedBefore', 'true');

				state = {
					...state,
					address: getAddress(account.address),
					chainId: account.chainId,
					isConnected: account.isConnected,
					shortAddress: truncateEthAddress(account.address || ''),
					fetchingBalance: true
				};
				set(state);

				console.log(account);

				getBalance(config, { address: account.address }).then((balanceResult) => {
					state = {
						...state,
						balance: balanceResult.value,
						fetchingBalance: false
					};
					set(state);
				});
			}
		});

		return () => {
			unwatchAccount();
		};
	},
	initialState
);
