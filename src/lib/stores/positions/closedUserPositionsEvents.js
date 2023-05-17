import { account } from '$lib/stores/wallet';
import { derived } from 'svelte/store';
import { addresses } from '../addresses';
import { parseAbi } from 'viem';
import { client } from '../client';
import { closedUserPositionsSubgraphUpdater } from './closedUserPositionsSubgraph';

/**
 * @typedef {Object} PositionClosedEvent
 * @property {bigint} id
 * @property {bigint} closePrice
 * @property {bigint} closeDate
 * @property {bigint} pnlShares
 */

/** @type {PositionClosedEvent[]} */
const initialPositionClosedEvents = [];

/**
 * @type {import('svelte/store').Readable<PositionClosedEvent[]>}
 */
export const closedUserPositionsEvents = derived(
	[account, addresses],
	([$account, $addresses], set) => {
		if (!$account.address) return;

		/** @type {PositionClosedEvent[]} */
		let positions = [];

		const unwatch = client.publicClient.watchContractEvent({
			address: $addresses.addresses.tradePair,
			abi: parseAbi([
				'event PositionClosed(address indexed trader,uint256 positionId,bool isLong,uint256 shares,uint256 entryPrice,uint256 leverage,int256 pnlShares,uint256 closePrice,uint256 closeDate)'
			]),
			args: { trader: $account.address },
			eventName: 'PositionClosed',
			onLogs: (log) => {
				closedUserPositionsSubgraphUpdater.requestUpdate();
				log.forEach(
					({ transactionHash, args: { positionId, pnlShares, closePrice, closeDate } }) => {
						const newClosedPosition = {
							id: positionId,
							openTransactionHash: transactionHash || '',
							closePrice: closePrice,
							closeDate: closeDate,
							pnlShares: pnlShares
						};
						positions = [...positions, newClosedPosition];
						set(positions);
					}
				);
			}
		});
		return unwatch;
	},
	initialPositionClosedEvents
);
