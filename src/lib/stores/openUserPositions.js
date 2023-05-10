import { queryStore, gql } from '@urql/svelte';
import { account } from './wallet';
import { graphClient } from './graph';
import { derived } from 'svelte/store';
import { currentPrice } from './priceFeed';
import { getTradePairContract } from '$lib/utils/contracts';
import { calculateSharesPnlPercentage } from '$lib/utils/position';
import { closedUserPositionsEvents } from './closedUserPositionsEvents';

// This file contains four stores:
// - openUserPositionsFromEvents
// - openUserPositionsFromSubgraph
// - openUserPositionsCombined (where both sources of positions are combined)
// - openUserPositions (where closed positions are filtered out)

/**
 * @typedef {Object} Position
 * @property {string} id
 * @property {boolean} isOpen
 * @property {boolean} isLong
 * @property {string} collateral
 * @property {string} shares
 * @property {string} leverage
 * @property {string} entryPrice
 * @property {string} liquidationPrice
 * @property {string} takeProfitPrice
 * @property {string} closePrice
 * @property {number} openDate
 * @property {number} closeDate
 * @property {string} pnlShares
 * @property {number} pnlSharesPercentage
 * @property {string} pnlAssets
 * @property {number} pnlAssetsPercentage
 */

/**
 * @typedef {Object} PositionStoreState
 * @property {Position[]} positions
 * @property {boolean} loading
 * @property {import("@urql/svelte").CombinedError | null} error
 */

/** @type {Position[]} */
const initialPositions = [];

/** @type {PositionStoreState} */
const initialPositionStoreState = {
	positions: initialPositions,
	loading: true,
	error: null
};

/**
 * @type {import('svelte/store').Readable<Position[]>}
 */
export const openUserPositionsFromEvents = derived(
	[account, currentPrice],
	([$account, $currentPrice], set) => {
		if (!$account.isConnected) return;

		/** @type {Position[]} */
		let positions = [];

		const tradePair = getTradePairContract();

		const positionOpenedFilter = tradePair.filters.PositionOpened(
			$account.address,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null
		);

		tradePair.on(
			positionOpenedFilter,
			(
				_trader,
				positionId,
				collateral,
				shares,
				leverage,
				isLong,
				entryPrice,
				liquidationPrice,
				takeProfitPrice,
				openDate
			) => {
				/** @type{Position} */
				const newPosition = {
					id: positionId?.toString() || '0',
					collateral: collateral?.toString() || '0',
					shares: shares?.toString() || '0',
					leverage: leverage?.toString() || '0',
					isLong: !!isLong,
					entryPrice: entryPrice?.toString() || '0',
					liquidationPrice: liquidationPrice?.toString() || '0',
					takeProfitPrice: takeProfitPrice?.toString() || '0',
					openDate: openDate?.toNumber() || 0,
					isOpen: true,
					closeDate: 0,
					closePrice: '0',
					pnlShares: '0',
					pnlSharesPercentage: 0,
					pnlAssets: '0',
					pnlAssetsPercentage: 0
				};

				newPosition.pnlSharesPercentage = calculateSharesPnlPercentage(newPosition, $currentPrice);

				positions = [...positions, newPosition];
				set(positions);
			}
		);

		return () => tradePair.removeAllListeners();
	},
	initialPositions
);

export const openUserPositionsFromSubgraph = derived(
	[account, currentPrice],
	([$account, $currentPrice], set) => {
		const unsubscribe = queryStore({
			client: graphClient,
			query: gql`
				query ($trader: String!) {
					positions(
						where: { and: [{ trader: $trader }, { isOpen: true }] }
						orderBy: openDate
						orderDirection: desc
					) {
						id
						collateral
						shares
						isOpen
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
		}).subscribe((result) => {
			if (result.data) {
				result.data.position = result.data.positions.map((/** @type {Position} */ position) => {
					position.pnlSharesPercentage = calculateSharesPnlPercentage(position, $currentPrice);
					return position;
				});
			}
			set(result);
		});

		return unsubscribe;
	}
);

export const openUserPositionsCombined = derived(
	[openUserPositionsFromEvents, openUserPositionsFromSubgraph],
	([$openUserPositionsFromEvents, $openUserPositionsFromSubgraph], set) => {
		// First fill positions from subgraph

		/** @type {Position[]} */
		let positions = [];

		if ($openUserPositionsFromSubgraph.fetching) {
			set({ positions, loading: true, error: null });
			return;
		}

		if ($openUserPositionsFromSubgraph.error) {
			set({ positions, loading: false, error: $openUserPositionsFromSubgraph.error });
			return;
		}

		if ($openUserPositionsFromSubgraph.data) {
			positions = $openUserPositionsFromSubgraph.data.positions;
		}

		// Then check if new positions from events are not already in the list
		// and add them to the top if missing
		$openUserPositionsFromEvents.forEach((position) => {
			if (!positions.find((p) => p.id === position.id)) {
				positions = [position, ...positions];
				set({ positions, loading: false, error: null });
			}
		});

		set({ positions, loading: false, error: null });
	},
	initialPositionStoreState
);

// Filter out closed positions
export const openUserPositions = derived(
	[openUserPositionsCombined, closedUserPositionsEvents],
	([$openUserPositionsCombined, $closedUserPositionsEvents], set) => {
		let positions = $openUserPositionsCombined.positions;

		// Finally filter out closed positions
		$closedUserPositionsEvents.forEach((position) => {
			positions = positions.filter((p) => p.id !== position.id);
		});

		set({ positions, loading: false, error: null });
	},
	initialPositionStoreState
);
