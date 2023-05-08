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

import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';

/**
 * @typedef {Object} PositionStoreState
 * @property {Position[]} positions
 * @property {boolean} loading
 * @property {import("@urql/svelte").CombinedError | null} error
 */

export const calculateSharesPnlPercentage = (
	/** @type {Position} */ position,
	/** @type {BigNumber} */ currentPrice
) => {
	if (position.isLong) {
		return parseFloat(
			formatUnits(
				currentPrice
					.sub(position.entryPrice)
					.mul(100) // make it a percentage
					.mul(BigNumber.from('1000000000000')) // add 12 decimals
					.mul(position.leverage) // add 6 decimals from leverage
					.div(position.entryPrice),
				18
			)
		);
	} else {
		return parseFloat(
			formatUnits(
				BigNumber.from(position.entryPrice)
					.sub(currentPrice)
					.mul(100) // make it a percentage
					.mul(BigNumber.from('1000000000000')) // add 12 decimals
					.mul(position.leverage) // add 6 decimals from leverage
					.div(position.entryPrice),
				18
			)
		);
	}
};
