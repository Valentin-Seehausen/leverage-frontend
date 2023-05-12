/**
 * @typedef {Object} FormatValueOptions
 * @property {boolean} [showSymbol]
 * @property {boolean} [showPlus]
 * @property {string} [symbol]
 */

import { formatUnits } from 'viem';

/**
 * @param {bigint} value
 * @param {number} decimals
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

	const prefix = mergedOptions.showPlus && value > 0 ? '+' : value < 0 ? '-' : '';

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
