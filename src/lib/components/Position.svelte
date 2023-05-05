<script>
	import { slide } from 'svelte/transition';
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	/**
	 * @typedef {Object} Position
	 * @property {number} id - The position ID.
	 * @property {boolean} isLong - Whether the position is long (true) or short (false).
	 * @property {number} collateral - The amount of collateral for the position.
	 * @property {number} leverage - The leverage used for the position.
	 * @property {number} entryPrice - The entry price for the position.
	 * @property {number} liquidationPrice - The liquidation price for the position.
	 * @property {number} takeProfitPrice - The take profit price for the position.
	 * @property {number} openDate - The timestamp of the position's open date.
	 * @property {number} closeDate - The timestamp of the position's close date.
	 * @property {number} pnl - The profit and loss percentage for the position.
	 */

	/** @type {Position} */
	export let position;

	let expanded = false;
	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<button
	class={`relative w-full p-4 rounded shadow-md transition-shadow duration-200 cursor-pointer lg:hover:shadow-lg ${
		expanded ? 'bg-white dark:bg-slate-800' : 'bg-gray-100 dark:bg-slate-900'
	}`}
	on:click={toggleExpanded}
>
	<div class="flex items-center justify-between">
		<div class="flex items-center">
			<div class={`font-bold text-lg mr-2 ${position.isLong ? 'text-green-600' : 'text-red-700'}`}>
				{position.isLong ? 'LONG' : 'SHORT'}
			</div>
			<span class="font-mono">{position.leverage}x</span>
		</div>
		<div class="font-mono">${position.collateral}</div>
	</div>
	<div class="flex items-center justify-between mt-2">
		<div class={`font-bold ${position.pnl >= 0 ? 'text-green-600' : 'text-red-700'}`}>
			PnL: {position.pnl}%
		</div>
		{#if !expanded}
			<div class="font-mono">EP: {position.entryPrice}</div>
			<div class="text-sm info-label">{dayjs.unix(position.openDate).fromNow()}</div>
		{/if}
	</div>
	{#if expanded}
		<div class="mt-4" transition:slide={{ duration: 200 }}>
			<div class="flex items-center justify-between text-sm info-label">
				<div>LP: {position.liquidationPrice}</div>
				<div>EP: {position.entryPrice}</div>
				<div>TP: {position.takeProfitPrice}</div>
			</div>
			<div class="mt-2 text-sm info-label">
				Open: {new Date(position.openDate * 1000).toLocaleString()} ({dayjs
					.unix(position.openDate)
					.fromNow()})
			</div>
			{#if position.closeDate && position.pnl !== null}
				<div class="mt-2 text-sm info-label">
					Close: {new Date(position.closeDate * 1000).toLocaleString()} ({dayjs
						.unix(position.closeDate)
						.fromNow()})
				</div>
			{/if}
		</div>
	{/if}
</button>
