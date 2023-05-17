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
 * @property {bigint} payoutShares
 * @property {bigint} pnlShares
 * @property {number} pnlSharesPercentage
 * @property {bigint} payoutAssets
 * @property {bigint} pnlAssets
 * @property {number} pnlAssetsPercentage
 * @property {bigint} openLpRatio
 * @property {bigint} closeLpRatio
 * @property {bigint} closeLpRatioBefore
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
		return Math.min(
			100,
			Math.max(
				-100,
				parseFloat(
					formatUnits(
						((currentPrice - position.entryPrice) *
							100n * // make it a percentage
							1000000000000n * // add 12 decimals
							position.leverage) / // add 6 decimals from leverage
							position.entryPrice,
						18
					)
				)
			)
		);
	} else {
		return Math.min(
			100,
			Math.max(
				-100,
				parseFloat(
					formatUnits(
						((position.entryPrice - currentPrice) *
							100n * // make it a percentage
							1000000000000n * // add 12 decimals
							position.leverage) / // add 6 decimals from leverage
							position.entryPrice,
						18
					)
				)
			)
		);
	}
};

export const calculatePnlShares = (/** @type {Position} */ position) => {
	return (position.shares * BigInt((position.pnlSharesPercentage * 10000).toFixed(0))) / 1000000n;
};

export const calculatePayoutShares = (/** @type {Position} */ position) => {
	return position.shares + position.pnlShares;
};

export const calculatePayoutAssets = (
	/** @type {Position} */ position,
	/** @type {bigint} */ liquidityPoolRatio
) => {
	return position.payoutShares / liquidityPoolRatio;
};

export const calculatePnlAssets = (/** @type {Position} */ position) => {
	return position.payoutAssets - position.collateral;
};

export const calculatePnlAssetsPercentage = (/** @type {Position} */ position) => {
	return Number((position.pnlAssets * 10000n) / position.collateral) / 100;
};
