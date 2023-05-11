import { gql, queryStore } from '@urql/svelte';
import { currentPriceUpdate } from '$lib/stores/priceFeed';
import { graphClientStore } from '../graph';
import { get, writable } from 'svelte/store';
import { BigNumber } from 'ethers';

const createCloseablePositionsStore = () => {
	/** @type {string[]} */
	const initialState = [];
	const { subscribe, set } = writable(initialState);

	let lastPrice = BigNumber.from(0);
	let deactivated = false;
	let graphClient = get(graphClientStore);

	/**
	 * @type {import("svelte/store").Unsubscriber}
	 */
	let unsubscribeQuery;

	const query = gql`
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
	`;

	const runQuery = () => {
		if (lastPrice.isZero()) return;
		if (unsubscribeQuery) unsubscribeQuery();

		unsubscribeQuery = queryStore({
			client: graphClient,
			query,
			variables: { currentPriceUpdate: lastPrice.toString() || '0' },
			requestPolicy: 'network-only'
		}).subscribe((result) => {
			set(result?.data?.positions.map((/** @type {{ id: string; }} */ p) => p.id) || []);
		});
	};

	// Run the query on every new price
	currentPriceUpdate.subscribe(($currentPriceUpdate) => {
		if (deactivated) return;
		if (lastPrice.eq($currentPriceUpdate)) return;
		lastPrice = $currentPriceUpdate;
		runQuery();
	});

	// Possibly update the graph client
	graphClientStore.subscribe(($graphClient) => {
		graphClient = $graphClient;
		runQuery();
	});

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
