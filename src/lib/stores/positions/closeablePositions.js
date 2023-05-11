import { gql } from '@urql/svelte';
import { currentPriceUpdate } from '$lib/stores/priceFeed';
import { graphClient } from '../graph';
import { writable } from 'svelte/store';
import { BigNumber } from 'ethers';

const createCloseablePositionsStore = () => {
	/** @type {string[]} */
	const initialState = [];
	const { subscribe, set } = writable(initialState);

	let lastPrice = BigNumber.from(0);
	let deactivated = false;

	// Run the query on every new price
	currentPriceUpdate.subscribe(($currentPriceUpdate) => {
		if (deactivated) return;
		if (lastPrice.eq($currentPriceUpdate)) return;
		lastPrice = $currentPriceUpdate;
		runQuery();
	});

	const runQuery = () => {
		graphClient
			.query(
				gql`
					query CloseablePositions($currentPriceUpdate: BigInt!) {
						positions(
							where: {
								and: [
									{ isOpen: true }
									{
										or: [
											{ maxClosePrice_lt: $currentPriceUpdate }
											{ minClosePrice_gte: $currentPriceUpdate }
										]
									}
								]
							}
						) {
							id
						}
					}
				`,
				{ variables: { currentPriceUpdate: lastPrice.toString() || '0' } }
			)
			.then((result) => {
				set(result?.data?.positions.map((/** @type {{ id: string; }} */ p) => p.id) || []);
			});
	};

	/**
	 * Deactivates the store for 20 seconds, as the subgraph needs time to update
	 */
	const reset = () => {
		deactivated = true;
		set(initialState);
		setTimeout(() => {
			deactivated = false;
			runQuery();
		}, 20000);
	};

	return { subscribe, reset };
};

export const closeablePositions = createCloseablePositionsStore();
