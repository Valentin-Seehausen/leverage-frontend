import { account } from '$lib/stores/wallet';
import { derived } from 'svelte/store';
import { contracts } from '$lib/stores/contracts';

/**
 * @typedef {Object} PositionClosedEvent
 * @property {string} id
 * @property {string} closePrice
 * @property {number} closeDate
 * @property {string} pnlShares
 */

/** @type {PositionClosedEvent[]} */
const initialPositionClosedEvents = [];

/**
 * @type {import('svelte/store').Readable<PositionClosedEvent[]>}
 */
export const closedUserPositionsEvents = derived(
	[account, contracts],
	([$account, $contracts], set) => {
		if (!$account.isConnected) return;
		if (!$contracts) return;

		/** @type {PositionClosedEvent[]} */
		let positions = [];

		const tradePair = $contracts.getTradePairContract();

		const positionClosedFilter = tradePair.filters.PositionClosed(
			$account.address,
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
			positionClosedFilter,
			(
				_trader,
				positionId,
				_isLong,
				_shares,
				_entryPrice,
				_leverage,
				pnlShares,
				closePrice,
				closeDate
			) => {
				const newClosedPosition = {
					id: positionId?.toString() || '',
					closePrice: closePrice?.toString() || '0',
					closeDate: closeDate?.toNumber() || 0,
					pnlShares: pnlShares?.toString() || '0'
				};

				positions = [...positions, newClosedPosition];
				set(positions);
			}
		);
		return tradePair.removeAllListeners;
	},
	initialPositionClosedEvents
);
