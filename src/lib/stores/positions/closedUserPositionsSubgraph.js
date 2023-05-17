import { queryStore, gql } from '@urql/svelte';
import { account } from '$lib/stores/wallet';
import { graphClientStore } from '$lib/stores/graph';
import { derived, writable } from 'svelte/store';

/**
 * @typedef {import('$lib/utils/position').Position} Position
 */
/** @type {Position[]} */
const initialPositions = [];

/** @type {import('$lib/utils/position').PositionStoreState} */
const initialPositionStoreState = {
	positions: initialPositions,
	loading: true,
	error: null
};

export const closedUserPositionsSubgraphUpdater = (() => {
	const { subscribe, update } = writable(0);

	return {
		subscribe,
		requestUpdate: () => {
			setTimeout(() => {
				update((n) => n + 1);
			}, 20000); // 20 seconds, thats how long TheGraph needs to update
		}
	};
})();

export const closedUserPositionsSubgraph = derived(
	[account, graphClientStore, closedUserPositionsSubgraphUpdater],
	([$account, $graphClientStore, $closedUserPositionsSubgraphUpdater], set) => {
		if (!$account.address) return;

		// When this stores updates, we want to update the subgraph and overwrite the closed positions from event
		$closedUserPositionsSubgraphUpdater;

		const unsubscribe = queryStore({
			client: $graphClientStore,
			query: gql`
				query ($trader: String!) {
					positions(
						where: { and: [{ trader: $trader }, { isOpen: false }] }
						orderBy: closeDate
						orderDirection: desc
					) {
						id
						collateral
						shares
						isLong
						isOpen
						liquidationPrice
						takeProfitPrice
						closePrice
						entryPrice
						isLong
						leverage
						openDate
						closeDate
						payoutShares
						pnlShares
						pnlSharesPercentage
						payoutAssets
						pnlAssets
						pnlAssetsPercentage
						openLpRatio
						closeLpRatio
						closeLpRatioBefore
					}
				}
			`,
			variables: { trader: $account.address.toLowerCase() || '' },
			requestPolicy: 'cache-and-network'
		}).subscribe((result) => {
			if (result.error) {
				set({ loading: false, error: result.error, positions: [] });
			} else if (result.data) {
				const newClosedPositions = result.data.positions.map((/** @type {any} */ position) => {
					/** @type{Position} */
					return {
						id: position.id,
						collateral: BigInt(position.collateral),
						shares: BigInt(position.shares),
						isOpen: position.isOpen,
						isLong: position.isLong,
						liquidationPrice: BigInt(position.liquidationPrice),
						takeProfitPrice: BigInt(position.takeProfitPrice),
						entryPrice: BigInt(position.entryPrice),
						closePrice: BigInt(position.closePrice),
						leverage: BigInt(position.leverage),
						openDate: position.openDate,
						closeDate: position.closeDate,
						payoutShares: BigInt(position.payoutShares),
						pnlShares: BigInt(position.pnlShares),
						pnlSharesPercentage: Number(position.pnlSharesPercentage),
						payoutAssets: BigInt(position.payoutAssets),
						pnlAssets: BigInt(position.pnlAssets),
						pnlAssetsPercentage: Number(position.pnlAssetsPercentage),
						openLpRatio: BigInt(position.openLpRatio),
						closeLpRatio: BigInt(position.closeLpRatio),
						closeLpRatioBefore: BigInt(position.closeLpRatioBefore)
					};
				});
				set({ loading: false, error: null, positions: newClosedPositions });
			}
		});

		return unsubscribe;
	},
	initialPositionStoreState
);
