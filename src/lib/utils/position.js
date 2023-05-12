import { formatUnits } from 'viem';

/**
 * @typedef {Object} Position
 * @property {string} id
 * @property {boolean} isOpen
 * @property {boolean} isLong
 * @property {bigint} collateral
 * @property {bigint} shares
 * @property {bigint} leverage
 * @property {bigint} entryPrice
 * @property {bigint} liquidationPrice
 * @property {bigint} takeProfitPrice
 * @property {bigint} closePrice
 * @property {number} openDate
 * @property {number} closeDate
 * @property {bigint} pnlShares
 * @property {number} pnlSharesPercentage
 * @property {bigint} pnlAssets
 * @property {number} pnlAssetsPercentage
 */

/**
 * @typedef {Object} PositionStoreState
 * @property {Position[]} positions
 * @property {boolean} loading
 * @property {import("@urql/svelte").CombinedError | null} error
 */

export const calculateSharesPnlPercentage = (
	/** @type {Position} */ position,
	/** @type {bigint} */ currentPrice
) => {
	if (position.isLong) {
		return parseFloat(
			formatUnits(
				currentPrice -
					(position.entryPrice *
						100n * // make it a percentage
						1000000000000n * // add 12 decimals
						position.leverage) / // add 6 decimals from leverage
						position.entryPrice,
				18
			)
		);
	} else {
		return parseFloat(
			formatUnits(
				position.entryPrice -
					(currentPrice *
						100n * // make it a percentage
						1000000000000n * // add 12 decimals
						position.leverage) / // add 6 decimals from leverage
						position.entryPrice,
				18
			)
		);
	}
};
