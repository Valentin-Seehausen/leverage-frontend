/**
 * Interpolate between two bigints.
 * @param {bigint} a - Start value.
 * @param {bigint} b - End value.
 * @returns {(t: number) => bigint} A function that takes a number between 0 and 1 and returns a bigint.
 */
export const interpolateBigInts = (a, b) => (t) => {
	const ad = a * (1000000n - BigInt((t * 1000000).toFixed(0)));
	const bd = b * BigInt((t * 1000000).toFixed(0));
	return (ad + bd) / 1000000n;
};
