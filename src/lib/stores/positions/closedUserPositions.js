import { derived } from 'svelte/store';
import { liquidityPoolRatio } from '$lib/stores/liquidityPool';
import { openUserPositionsCombined } from './openUserPositions';
import { closedUserPositionsEvents } from './closedUserPositionsEvents';
import { closedUserPositionsSubgraph } from './closedUserPositionsSubgraph';

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
		// the data from openUserPositions (entryPrice, collateral, etc.) is needed to populate the data here
		$closedUserPositionsEvents.forEach((closedPositionEvent) => {
			const matchingOpenPosition = $openUserPositionsCombined.positions.find(
				(p) => p.id === closedPositionEvent.id.toString()
			);

			if (!matchingOpenPosition) return;

			// If this position is already in the list, skip it as subgraph takes precedence
			if (
				$closedUserPositionsSubgraph.positions.find(
					(p) => p.id === closedPositionEvent.id.toString()
				)
			)
				return;

			const newClosedPosition = {
				...matchingOpenPosition,
				closePrice: closedPositionEvent.closePrice,
				closeDate: Number(closedPositionEvent.closeDate),
				payoutShares: closedPositionEvent.pnlShares + matchingOpenPosition.shares,
				pnlShares: closedPositionEvent.pnlShares,
				isOpen: false,
				pnlSharesPercentage: closedPositionEvent.pnlShares < 0 ? -100 : 100
			};

			if ($liquidityPoolRatio > 0) {
				if (newClosedPosition.pnlShares > 0n) {
					newClosedPosition.payoutAssets = newClosedPosition.payoutShares / $liquidityPoolRatio;
					newClosedPosition.pnlAssets =
						newClosedPosition.payoutAssets - newClosedPosition.collateral;
					newClosedPosition.pnlAssetsPercentage = parseFloat(
						(
							(newClosedPosition.pnlAssets * 10000n) /
							newClosedPosition.collateral /
							100n
						).toString()
					);
				} else {
					newClosedPosition.payoutAssets = 0n;
					newClosedPosition.pnlAssets = -newClosedPosition.collateral;
					newClosedPosition.pnlAssetsPercentage = -100;
				}
				newClosedPosition.closeLpRatio = $liquidityPoolRatio;
			}

			positions = [newClosedPosition, ...positions];
		});
		set({ positions, loading: false, error: null });
	},
	initialPositionStoreState
);
