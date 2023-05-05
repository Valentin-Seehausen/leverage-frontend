import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';

/**
 * @typedef {Object} FormatValueOptions
 * @property {boolean} [showSymbol]
 * @property {string} [symbol]
 */

/**
 * @param {import("ethers").BigNumberish} value
 * @param {import("ethers").BigNumberish | undefined} decimals
 * @param {number | undefined} precision
 * @param {FormatValueOptions} [options]
 * @returns {string}
 */
export const formatValue = (value, decimals, precision = 2, options) => {
	const defaultOptions = {
		showSymbol: true,
		locale: 'en-US',
		currency: 'USD'
	};
	const mergedOptions = { ...defaultOptions, ...options };

	const formattedValue = formatUnits(value, decimals);

	const numberFormatOptions = {
		style: mergedOptions.showSymbol ? 'currency' : 'decimal',
		currency: mergedOptions.currency,
		minimumFractionDigits: precision,
		maximumFractionDigits: precision
	};

	const formattedNumber = new Intl.NumberFormat(mergedOptions.locale, numberFormatOptions).format(
		Math.abs(+formattedValue)
	);

	return BigNumber.from(value).isNegative() ? '-' + formattedNumber : formattedNumber;
};
