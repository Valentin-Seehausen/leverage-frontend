import { queryStore, gql } from '@urql/svelte';
import { account } from './wallet';
import { graphClient } from './graph';
import { derived } from 'svelte/store';
import { BigNumber } from 'ethers';
import { liquidityPoolRatio } from './liquidityPool';
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

export const closedUserPositionsSubgraph = derived(account, ($account, set) => {
	const unsubscribe = queryStore({
		client: graphClient,
		query: gql`
			query ($trader: String!) {
				positions(where: { and: [{ trader: $trader }, { isOpen: false }] }) {
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
	}).subscribe(set);

	return unsubscribe;
});

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
		// First fill positions from subgraph

		/** @type {Position[]} */
		let positions = [];

		if ($closedUserPositionsSubgraph.fetching) {
			set({ positions, loading: true, error: null });
			return;
		}

		if ($closedUserPositionsSubgraph.error) {
			set({ positions, loading: false, error: $closedUserPositionsSubgraph.error });
			return;
		}

		if ($closedUserPositionsSubgraph.data) {
			positions = $closedUserPositionsSubgraph.data.positions;
		}

		// Check if new closed positions are in open positions and thus have to be added to the list
		$closedUserPositionsEvents.forEach((closedPositionEvent) => {
			const matchingOpenPosition = $openUserPositionsCombined.positions.find(
				(p) => p.id === closedPositionEvent.id
			);

			if (!matchingOpenPosition) return;

			const newClosedPosition = {
				...matchingOpenPosition,
				closePrice: closedPositionEvent.closePrice,
				closeDate: closedPositionEvent.closeDate,
				pnlShares: closedPositionEvent.pnlShares,
				isOpen: false,
				pnlSharesPercentage: BigNumber.from(closedPositionEvent.pnlShares)?.isNegative()
					? -100
					: 100
			};

			if ($liquidityPoolRatio > 0) {
				newClosedPosition.pnlAssets =
					BigNumber.from(closedPositionEvent.pnlShares).div($liquidityPoolRatio).toString() || '0';
				newClosedPosition.pnlAssetsPercentage = BigNumber.from(newClosedPosition.pnlAssets)
					.mul(10000)
					.div(newClosedPosition.collateral)
					.div(100)
					.toNumber();
			}

			positions = [...positions, newClosedPosition];
		});
		set({ positions, loading: false, error: null });
	},
	initialPositionStoreState
);
