import { queryStore, gql } from '@urql/svelte';
import { account } from '$lib/stores/wallet';
import { graphClientStore } from '$lib/stores/graph';
import { derived } from 'svelte/store';

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

export const closedUserPositionsSubgraph = derived(
	[account, graphClientStore],
	([$account, $graphClientStore], set) => {
		if (!$account.address) return;

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
						pnlShares
						pnlSharesPercentage
						pnlAssets
						pnlAssetsPercentage
					}
				}
			`,
			variables: { trader: $account.address.toLowerCase() || '' }
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
						pnlShares: BigInt(position.pnlShares),
						pnlSharesPercentage: Number(position.pnlSharesPercentage),
						pnlAssets: BigInt(position.pnlAssets),
						pnlAssetsPercentage: Number(position.pnlAssetsPercentage)
					};
				});
				set({ loading: false, error: null, positions: newClosedPositions });
			}
		});

		return unsubscribe;
	},
	initialPositionStoreState
);
