import { gql, queryStore } from '@urql/svelte';
import { currentPriceUpdate } from '$lib/stores/priceFeed';
import { graphClientStore } from '../graph';
import { get, writable } from 'svelte/store';

const createCloseablePositionsStore = () => {
	/** @type {bigint[]} */
	const initialState = [];
	const { subscribe, set } = writable(initialState);

	let lastPrice = 0n;
	let deactivated = false;
	let graphClient = get(graphClientStore);

	/**
	 * @type {import("svelte/store").Unsubscriber}
	 */
	let unsubscribeQuery;

	const query = gql`
		query CloseablePositions($price: BigInt!) {
			positions(
				where: {
					and: [
						{ isOpen: true }
						{ or: [{ maxClosePrice_lt: $price }, { minClosePrice_gte: $price }] }
					]
				}
			) {
				id
			}
		}
	`;

	const runQuery = () => {
		if (lastPrice == 0n) return;
		if (unsubscribeQuery) unsubscribeQuery();

		unsubscribeQuery = queryStore({
			client: graphClient,
			query,
			variables: { price: lastPrice.toString() },
			requestPolicy: 'network-only'
		}).subscribe((result) => {
			console.log(result);
			set(result?.data?.positions.map((/** @type {{ id: string; }} */ p) => BigInt(p.id)) || []);
		});
	};

	// Run the query on every new price
	currentPriceUpdate.subscribe(($currentPriceUpdate) => {
		if (deactivated) return;
		if (lastPrice == $currentPriceUpdate) return;
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
