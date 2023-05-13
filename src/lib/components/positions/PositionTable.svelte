<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { leverageDecimals, priceFeedDecimals, usdcDecimals } from '$lib/config/constants';
	import { formatPercentage, formatValue } from '$lib/utils/format';
	import { slide } from 'svelte/transition';
	import { getContext } from 'svelte';
	import PositionModal from './PositionModal.svelte';
	const { open } = getContext('simple-modal');

	dayjs.extend(relativeTime);

	/** @type {import("$lib/utils/position").Position[]} */
	export let positions;
	/** @type {string} */
	export let show;

	const openPositionModal = (/** @type {import('$lib/utils/position').Position}*/ position) =>
		open(PositionModal, { position: position });

	// $: positions.length > 0 && open(PositionModal, { position: positions[0] });
</script>

<div class="flex flex-col">
	<div class="flex py-3">
		<div class="pl-3 w-1/6">Type</div>
		<div class="w-1/6 text-right">Leverage</div>
		<div class="w-1/6 text-right">Collateral</div>
		<div class="w-1/6 text-right">Entry Price</div>
		{#if show === 'open'}
			<div class="w-1/6 text-right">Liquidation Price</div>
			<div class="w-1/6 text-right">Take Profit Price</div>
		{:else if show === 'closed'}
			<div class="w-1/6 text-right">Close Price</div>
			<div class="w-1/6 text-right pr-3">PnL</div>
		{/if}
	</div>

	{#each positions as position, index (position.id)}
		<div
			class={`flex flex-col cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 ${
				index % 2 == 0 ? 'dark:bg-slate-800 dark:bg-opacity-50' : ''
			}`}
			on:click={() => openPositionModal(position)}
			on:keypress={() => openPositionModal(position)}
			transition:slide|local
		>
			<div class="flex py-2">
				<div class="pl-2 w-1/6">
					<span class={`font-bold text-lg ${position.isLong ? 'text-green-600' : 'text-red-700'}`}
						>{position.isLong ? 'LONG' : 'SHORT'}</span
					>
				</div>
				<div class="w-1/6 text-right">
					<span class="font-mono"
						>{formatValue(position.leverage, leverageDecimals, 0, { showSymbol: false })}x</span
					>
				</div>
				<div class="w-1/6 text-right">
					<span class="font-mono">{formatValue(position.collateral, usdcDecimals, 2)}</span>
				</div>
				<div class="w-1/6 text-right">
					<span class="font-mono">{formatValue(position.entryPrice, priceFeedDecimals, 2)}</span>
				</div>
				{#if position.isOpen}
					<div class="w-1/6 text-right">
						<span class="font-mono"
							>{formatValue(position.liquidationPrice, priceFeedDecimals, 2)}</span
						>
					</div>
					<div class="w-1/6 text-right">
						<span class="font-mono"
							>{formatValue(position.takeProfitPrice, priceFeedDecimals, 2)}</span
						>
					</div>
				{:else}
					<div class="w-1/6 text-right">
						<span class="font-mono">{formatValue(position.closePrice, priceFeedDecimals, 2)}</span>
					</div>
					<div class="w-1/6 text-right pr-3">
						<span
							class={`font-extrabold ${
								position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
							}`}>{formatPercentage(position.pnlSharesPercentage)}</span
						>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
