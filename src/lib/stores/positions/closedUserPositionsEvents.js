import { account } from '$lib/stores/wallet';
import { derived } from 'svelte/store';
import { getTradePairContract } from '$lib/utils/contracts';

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
	account,
	($account, set) => {
		if (!$account.isConnected) return;

		/** @type {PositionClosedEvent[]} */
		let positions = [];

		const tradePair = getTradePairContract();

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

		tradePair.on(positionClosedFilter, (_trader, positionId, closePrice, closeDate, pnlShares) => {
			const newClosedPosition = {
				id: positionId?.toString() || '',
				closePrice: closePrice?.toString() || '0',
				closeDate: closeDate?.toNumber() || 0,
				pnlShares: pnlShares?.toString() || '0'
			};

			positions = [...positions, newClosedPosition];
			set(positions);
		});

		return () => tradePair.removeAllListeners();
	},
	initialPositionClosedEvents
);
