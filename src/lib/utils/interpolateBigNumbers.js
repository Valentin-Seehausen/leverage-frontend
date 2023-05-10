import { BigNumber } from 'ethers';

/**
 * Interpolate between two BigNumbers.
 * @param {import('ethers').BigNumber} a - Start value.
 * @param {import('ethers').BigNumber} b - End value.
 * @returns {(t: number) => import('ethers').BigNumber} A function that takes a number between 0 and 1 and returns a BigNumber.
 */
export const interpolateBigNumbers = (a, b) => (t) => {
	const ad = a.mul(BigNumber.from(1000000).sub(BigNumber.from((t * 1000000).toFixed(0))));
	const bd = b.mul(BigNumber.from((t * 1000000).toFixed(0)));
	return ad.add(bd).div(BigNumber.from(1000000));
};
