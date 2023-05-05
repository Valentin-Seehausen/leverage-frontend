import { queryStore, gql } from '@urql/svelte';
import { account } from './wallet';
import { graphClient } from './graph';
import { derived } from 'svelte/store';

export const openUserPositions = derived(account, ($account, set) => {
	const unsubscribe = queryStore({
		client: graphClient,
		query: gql`
			query ($trader: String!) {
				positions(where: { trader: $trader }) {
					id
					trader {
						id
					}
					collateral
					shares
					isLong
					liquidationPrice
					takeProfitPrice
					entryPrice
					isLong
					leverage
					openDate
				}
			}
		`,
		variables: { trader: $account.address.toLowerCase() || '' }
	}).subscribe(set);

	return unsubscribe;
});
