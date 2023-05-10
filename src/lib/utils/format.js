import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';

/**
 * @typedef {Object} FormatValueOptions
 * @property {boolean} [showSymbol]
 * @property {boolean} [showPlus]
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
		showPlus: false,
		locale: 'en-US',
		currency: 'USD'
	};
	const mergedOptions = { ...defaultOptions, ...options };

	const formattedValue = formatUnits(value, decimals);

	const numberFormatOptions = {
		style: mergedOptions.showSymbol ? 'currency' : 'decimal',
		currency: mergedOptions.currency,
		minimumFractionDigits: precision,
		maximumFractionDigits: 2
	};

	const formattedNumber = new Intl.NumberFormat(mergedOptions.locale, numberFormatOptions).format(
		Math.abs(+formattedValue)
	);

	const prefix =
		mergedOptions.showPlus && !BigNumber.from(value).isNegative()
			? '+'
			: BigNumber.from(value).isNegative()
			? '-'
			: '';

	return prefix + formattedNumber;
};

/**
 * @param {number | string} value
 * @returns
 */
export const formatPercentage = (value) => {
	if (typeof value === 'number') {
		const prefix = value >= 0 ? '+' : '';
		return prefix + value.toFixed(2) + '%';
	} else if (typeof value === 'string') {
		const prefix = value.startsWith('-') ? '+' : '';
		const fixedValue = parseFloat(value).toFixed(2);
		return prefix + fixedValue + '%';
	}
	return value;
};
