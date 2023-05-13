import { queryStore, gql } from '@urql/svelte';
import { account } from '$lib/stores/wallet';
import { graphClientStore } from '$lib/stores/graph';
import { derived } from 'svelte/store';
import { liquidityPoolRatio } from '$lib/stores/liquidityPool';
import { openUserPositionsCombined } from './openUserPositions';
import { closedUserPositionsEvents } from './closedUserPositionsEvents';

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

export const closedUserPositions = derived(
	[
		closedUserPositionsSubgraph,
		closedUserPositionsEvents,
		openUserPositionsCombined,
		liquidityPoolRatio
	],
	(
		[
			$closedUserPositionsSubgraph,
			$closedUserPositionsEvents,
			$openUserPositionsCombined,
			$liquidityPoolRatio
		],
		set
	) => {
		if (!$openUserPositionsCombined) return;

		/**
		 *  @type {Position[]}
		 */
		let positions = [];

		// First fill positions from subgraph
		if ($closedUserPositionsSubgraph.loading) {
			set({ positions, loading: true, error: null });
			return;
		}

		if ($closedUserPositionsSubgraph.error) {
			set({ positions, loading: false, error: $closedUserPositionsSubgraph.error });
			return;
		}

		positions = $closedUserPositionsSubgraph.positions;

		// Check if new closed positions are in open positions and thus have to be added to the list
		$closedUserPositionsEvents.forEach((closedPositionEvent) => {
			const matchingOpenPosition = $openUserPositionsCombined.positions.find(
				(p) => p.id === closedPositionEvent.id.toString()
			);

			if (!matchingOpenPosition) return;

			const newClosedPosition = {
				...matchingOpenPosition,
				closePrice: closedPositionEvent.closePrice,
				closeDate: Number(closedPositionEvent.closeDate),
				pnlShares: closedPositionEvent.pnlShares,
				isOpen: false,
				pnlSharesPercentage: closedPositionEvent.pnlShares < 0 ? -100 : 100
			};

			if ($liquidityPoolRatio > 0) {
				if (newClosedPosition.pnlShares > 0n) {
					newClosedPosition.pnlAssets = closedPositionEvent.pnlShares / $liquidityPoolRatio;
					newClosedPosition.pnlAssetsPercentage = parseFloat(
						(
							(newClosedPosition.pnlAssets * 10000n) /
							newClosedPosition.collateral /
							100n
						).toString()
					);
				} else {
					newClosedPosition.pnlAssets = -newClosedPosition.collateral;
					newClosedPosition.pnlAssetsPercentage = -100;
				}
			}

			positions = [...positions, newClosedPosition];
		});
		set({ positions, loading: false, error: null });
	},
	initialPositionStoreState
);
