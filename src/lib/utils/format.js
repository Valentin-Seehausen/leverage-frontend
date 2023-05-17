/**
 * @typedef {Object} FormatValueOptions
 * @property {boolean} [showSymbol]
 * @property {boolean} [showPlus]
 * @property {string} [symbol]
 * @property {string} [prefix]
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
		currency: 'USD',
		prefix: ''
	};
	const mergedOptions = {
		...defaultOptions,
		...options
	};

	const formattedValue = formatUnits(value, decimals);

	const numberFormatOptions = {
		style: mergedOptions.showSymbol ? 'currency' : 'decimal',
		currency: mergedOptions.currency,
		minimumFractionDigits: precision,
		maximumFractionDigits: 2
	};

	const formattedNumber =
		mergedOptions.prefix +
		new Intl.NumberFormat(mergedOptions.locale, numberFormatOptions).format(
			Math.abs(+formattedValue)
		);

	const secondPrefix = mergedOptions.showPlus && value > 0 ? '+' : value < 0 ? '-' : '';

	return secondPrefix + formattedNumber;
};

/**
 * @typedef {Object} FormatPercentageOptions
 * @property {number | undefined} [decimals]
 */

/**
 * @param {number | string} value
 * @param {FormatPercentageOptions} [options]
 * @returns
 */
export const formatPercentage = (value, options = { decimals: 2 }) => {
	if (typeof value === 'number') {
		const prefix = value >= 0 ? '+' : '';
		return prefix + value.toFixed(options.decimals) + '%';
	} else if (typeof value === 'string') {
		const prefix = value.startsWith('-') ? '+' : '';
		const fixedValue = parseFloat(value).toFixed(options.decimals);
		return prefix + fixedValue + '%';
	}
	return value;
};
