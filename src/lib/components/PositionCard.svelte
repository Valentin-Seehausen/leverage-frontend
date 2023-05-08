<script>
	import { slide } from 'svelte/transition';
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { leverageDecimals, priceFeedDecimals, usdcDecimals } from '$lib/config/constants';
	import { formatPercentage, formatValue } from '$lib/utils/format';

	dayjs.extend(relativeTime);

	/** @type {import("$lib/stores/positions.js").Position} */
	export let position;

	let expanded = false;
	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<button
	class={`relative w-full p-4 rounded shadow-lg transition-shadow duration-200 cursor-pointer ${
		expanded ? 'bg-white dark:bg-slate-800' : 'bg-gray-100 dark:bg-slate-800'
	}`}
	on:click={toggleExpanded}
>
	<div class="flex items-center justify-between">
		<div class="flex items-center">
			<div class={`font-bold text-lg mr-2 ${position.isLong ? 'text-green-600' : 'text-red-700'}`}>
				{position.isLong ? 'LONG' : 'SHORT'}
			</div>
			<span class="font-mono"
				>{formatValue(position.leverage, leverageDecimals, 0, { showSymbol: false })}x</span
			>
		</div>
		<div class="font-mono">{formatValue(position.collateral, usdcDecimals, 2)}</div>
	</div>
	<div class="flex items-center justify-between mt-2">
		<div
			class={`font-bold ${position.pnlSharesPercentage >= 0 ? 'text-green-600' : 'text-red-700'}`}
		>
			{formatPercentage(position.pnlSharesPercentage)}
		</div>
		{#if !expanded}
			<div class="font-mono">
				EP: {formatValue(position.entryPrice, priceFeedDecimals, 2)}
			</div>
			<div class="text-sm info-label">{dayjs.unix(position.openDate).fromNow()}</div>
		{/if}
	</div>
	{#if expanded}
		<div class="mt-4" transition:slide={{ duration: 200 }}>
			<div class="flex items-center justify-between text-sm info-label">
				<div>LP: {formatValue(position.liquidationPrice, priceFeedDecimals, 2)}</div>
				<div>EP: {formatValue(position.entryPrice, priceFeedDecimals, 2)}</div>
				<div>TP: {formatValue(position.takeProfitPrice, priceFeedDecimals, 2)}</div>
			</div>
			<div class="mt-2 text-sm info-label">
				Opened: {new Date(position.openDate * 1000).toLocaleString()}
			</div>
			{#if !position.isOpen}
				<div class="mt-2 text-sm info-label">
					Closed: {new Date(position.closeDate * 1000).toLocaleString()}
				</div>
			{/if}
		</div>
	{/if}
</button>
