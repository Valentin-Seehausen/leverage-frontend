import { queryStore, gql } from '@urql/svelte';
import { account } from '$lib/stores/wallet';
import { graphClientStore } from '$lib/stores/graph';
import { derived, get } from 'svelte/store';
import { currentPriceTweened } from '$lib/stores/priceFeed';
import { calculateSharesPnlPercentage } from '$lib/utils/position';
import { closedUserPositionsEvents } from './closedUserPositionsEvents';
import { client } from '../client';
import { addresses } from '../addresses';
import { parseAbi } from 'viem';

// This file contains four stores:
// - openUserPositionsFromEvents
// - openUserPositionsFromSubgraph
// - openUserPositionsCombined (where both sources of positions are combined)
// - openUserPositions (where closed positions are filtered out)

/**
 * @typedef {import('$lib/utils/position').Position} Position
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
	account,
	($account, set) => {
		if (!$account.address) return;

		/** @type {Position[]} */
		let positions = [];

		const unwatch = client.publicClient.watchContractEvent({
			address: get(addresses).addresses.tradePair,
			abi: parseAbi([
				'event PositionOpened(address indexed trader,uint256 positionId,uint256 collateral,uint256 shares,uint256 leverage,bool isLong,uint256 entryPrice,uint256 liquidationPrice,uint256 takeProfitPrice,uint256 openDate)'
			]),
			args: { trader: $account.address },
			eventName: 'PositionOpened',
			onLogs: (log) => {
				console.log('PositionOpened for user', log);
				log.forEach(
					({
						args: {
							collateral,
							positionId,
							shares,
							leverage,
							isLong,
							entryPrice,
							liquidationPrice,
							takeProfitPrice,
							openDate
						}
					}) => {
						/** @type{Position} */
						const newPosition = {
							id: positionId,
							collateral: collateral,
							shares: shares,
							leverage: leverage,
							isLong: isLong,
							entryPrice: entryPrice,
							liquidationPrice: liquidationPrice,
							takeProfitPrice: takeProfitPrice,
							openDate: Number(openDate),
							isOpen: true,
							closeDate: 0,
							closePrice: 0n,
							pnlShares: 0n,
							pnlSharesPercentage: 0,
							pnlAssets: 0n,
							pnlAssetsPercentage: 0
						};

						positions = [...positions, newPosition];
						set(positions);
					}
				);
			}
		});

		return unwatch;
	},
	initialPositions
);

export const openUserPositionsFromSubgraph = derived(
	[account, graphClientStore],
	([$account, $graphClientStore], set) => {
		if (!$account.address) return;
		if (!graphClientStore) return;

		const unsubscribe = queryStore({
			client: $graphClientStore,
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
						leverage
						openDate
					}
				}
			`,
			variables: { trader: $account.address.toLowerCase() || '' }
		}).subscribe((result) => {
			if (result.error) {
				set({ loading: false, error: result.error, positions: [] });
			} else if (result.data) {
				const parsedPositions = result.data.positions.map((/** @type {any} */ position) => {
					return {
						id: position.id,
						collateral: BigInt(position.collateral),
						shares: BigInt(position.shares),
						isOpen: position.isOpen,
						isLong: position.isLong,
						liquidationPrice: BigInt(position.liquidationPrice),
						takeProfitPrice: BigInt(position.takeProfitPrice),
						entryPrice: BigInt(position.entryPrice),
						leverage: BigInt(position.leverage),
						openDate: position.openDate
					};
				});
				set({ loading: false, error: null, positions: parsedPositions });
			}
		});

		return unsubscribe;
	},
	initialPositionStoreState
);

export const openUserPositionsCombined = derived(
	[openUserPositionsFromEvents, openUserPositionsFromSubgraph],
	([$openUserPositionsFromEvents, $openUserPositionsFromSubgraph], set) => {
		// First fill positions from subgraph

		/** @type {Position[]} */
		let positions = [];

		if ($openUserPositionsFromSubgraph.loading) {
			set({ positions, loading: true, error: null });
			return;
		}

		if ($openUserPositionsFromSubgraph.error) {
			set({ positions, loading: false, error: $openUserPositionsFromSubgraph.error });
			return;
		}

		positions = $openUserPositionsFromSubgraph.positions;

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
	[openUserPositionsCombined, closedUserPositionsEvents, currentPriceTweened],
	([$openUserPositionsCombined, $closedUserPositionsEvents, $currentPriceTweened], set) => {
		let positions = $openUserPositionsCombined.positions;

		// Finally filter out closed positions
		$closedUserPositionsEvents.forEach((position) => {
			positions = positions.filter((p) => p.id !== position.id);
		});

		// Set pnlSharesPercentage
		positions.map((position) => {
			position.pnlSharesPercentage = calculateSharesPnlPercentage(position, $currentPriceTweened);
			return position;
		});

		set({ positions, loading: false, error: null });
	},
	initialPositionStoreState
);
