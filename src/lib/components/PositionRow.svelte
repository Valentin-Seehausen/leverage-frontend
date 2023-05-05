<script>
	import { slide } from 'svelte/transition';
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { formatUnits } from 'ethers/lib/utils.js';
	import { leverageDecimals, priceFeedDecimals, usdcDecimals } from '$lib/config/constants';
	import { formatValue } from '$lib/utils/format';

	dayjs.extend(relativeTime);

	/**
	 * @typedef {Object} Position
	 * @property {number} id - The position ID.
	 * @property {boolean} isLong - Whether the position is long (true) or short (false).
	 * @property {number} collateral - The amount of collateral for the position.
	 * @property {string} leverage - The leverage used for the position.
	 * @property {number} entryPrice - The entry price for the position.
	 * @property {number} liquidationPrice - The liquidation price for the position.
	 * @property {number} takeProfitPrice - The take profit price for the position.
	 * @property {number} openDate - The timestamp of the position's open date.
	 * @property {number} closeDate - The timestamp of the position's close date.
	 * @property {number} pnl - The profit and loss percentage for the position.
	 */

	/** @type {Position} */
	export let position;
	/** @type {number} */
	export let index;

	let expanded = false;
	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<tr
	class={`position-row cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 ${
		index % 2 == 0 ? 'dark:bg-slate-800 dark:bg-opacity-50' : ''
	}`}
	on:click={toggleExpanded}
>
	<td class="pl-2 px-0 py-2">
		<span class={`font-bold text-lg ${position.isLong ? 'text-green-600' : 'text-red-700'}`}>
			{position.isLong ? 'LONG' : 'SHORT'}
		</span>
	</td>
	<td class=" px-0 py-2 text-right">
		<span class="font-mono"
			>{formatValue(position.leverage, leverageDecimals, 0, { showSymbol: false })}x</span
		>
	</td>
	<td class=" px-2 py-2 text-right">
		<span class="font-mono">{formatValue(position.collateral, usdcDecimals, 2)}</span>
	</td>
	<td class=" px-2 py-2 text-right">
		<span class="font-mono">{formatValue(position.entryPrice, priceFeedDecimals, 2)}</span>
	</td>
	<td class=" px-2 py-2 text-right">
		<span class="font-mono">{formatValue(position.liquidationPrice, priceFeedDecimals, 2)}</span>
	</td>
	<td class=" px-2 py-2 text-right">
		<span class="font-mono">{formatValue(position.takeProfitPrice, priceFeedDecimals, 2)}</span>
	</td>
</tr>

{#if expanded}
	<tr
		class={`bg-gray-100  ${
			index % 2 == 0 ? 'dark:bg-slate-800 dark:bg-opacity-50' : 'dark:bg-slate-900'
		}`}
	>
		<td colspan="3" class="pl-2 py-2 mb-6">
			<span class="info-label">Opened:</span>
			{new Date(position.openDate * 1000).toLocaleString()}
		</td>
		<td colspan="3" class="pr-2 py-2 mb-6 text-right">
			<span class="info-label">Current PnL:</span>
			{position.pnl}%
		</td>
	</tr>
{/if}
