<script>
	import { slide } from 'svelte/transition';
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { formatUnits } from 'ethers/lib/utils.js';
	import {
		leverageDecimals,
		percentageDecimals,
		priceFeedDecimals,
		usdcDecimals
	} from '$lib/config/constants';
	import { formatPercentage, formatValue } from '$lib/utils/format';

	dayjs.extend(relativeTime);

	/** @type {import("$lib/stores/positions.js").Position} */
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
	{#if position.isOpen}
		<td class=" px-2 py-2 text-right">
			<span class="font-mono">{formatValue(position.liquidationPrice, priceFeedDecimals, 2)}</span>
		</td>
		<td class=" px-2 py-2 text-right">
			<span class="font-mono">{formatValue(position.takeProfitPrice, priceFeedDecimals, 2)}</span>
		</td>
	{:else}
		<td class=" px-2 py-2 text-right">
			<span class="font-mono">{formatValue(position.closePrice, priceFeedDecimals, 2)}</span>
		</td>
		<td
			colspan="3"
			class={`px-2 py-2 text-right font-extrabold ${
				position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
			}`}
		>
			{formatPercentage(position.pnlSharesPercentage)}
		</td>
	{/if}
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
		<td
			colspan="3"
			class={`pr-2 py-2 mb-6 text-right font-extrabold ${
				position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
			}`}
		>
			{formatPercentage(position.pnlSharesPercentage)}
		</td>
	</tr>
{/if}
