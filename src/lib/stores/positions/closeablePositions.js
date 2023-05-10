import { queryStore, gql } from '@urql/svelte';
import { currentPriceUpdate } from '$lib/stores/priceFeed';
import { graphClient } from '../graph';
import { derived } from 'svelte/store';

/**
 * @type {import('svelte/store').Readable<string[]>}
 */
export const closeablePositionIds = derived(
	currentPriceUpdate,
	($currentPriceUpdate, set) => {
		if ($currentPriceUpdate.isZero()) set([]);

		const unsubscribe = queryStore({
			client: graphClient,
			query: gql`
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
						maxClosePrice
						minClosePrice
					}
				}
			`,
			variables: { currentPriceUpdate: $currentPriceUpdate.toString() || '0' }
		}).subscribe((result) => {
			set(result?.data?.positions.map((/** @type {{ id: string; }} */ p) => p.id) || []);
		});

		return unsubscribe;
	},
	[]
);
