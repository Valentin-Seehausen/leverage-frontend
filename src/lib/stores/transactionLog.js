import { waitForTransaction } from '@wagmi/core';
import { writable } from 'svelte/store';
import { config } from './client';

// Define type transactionLog with params: hash-string and message-string
/**
 * @typedef {Object} TransactionEntry
 * @property {`0x${string}`} hash
 * @property {string} message
 */

const createTransactionLogStore = () => {
	/** @type {TransactionEntry[]} */
	const initialState = [
		// {
		// 	hash: '0xassd',
		// 	message: 'Opening Position'
		// },
		// {
		// 	hash: '0xasd',
		// 	message: 'Closing Position Aproove'
		// }
	];

	const { subscribe, update } = writable(initialState);

	/** @param {TransactionEntry} transaction */
	const add = (transaction) => {
		waitForTransaction(config, { hash: transaction.hash }).then(() => {
			// remove hash from state array and set array
			update((state) => {
				return state.filter((h) => h.hash !== transaction.hash);
			});
		});

		update((state) => {
			return [...state, transaction];
		});
	};

	return {
		subscribe,
		add
	};
};

export const transactionLog = createTransactionLogStore();
