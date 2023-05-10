<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { leverageDecimals, priceFeedDecimals, usdcDecimals } from '$lib/config/constants';
	import { formatPercentage, formatValue } from '$lib/utils/format';
	import { slide } from 'svelte/transition';

	dayjs.extend(relativeTime);

	/** @type {import("$lib/utils/position").Position[]} */
	export let positions;

	/** @type {string} */
	export let show;

	/** @type {string[]} */
	let expandedOpenPositions = [];
	/** @type {string[]} */
	let expandedClosedPositions = [];

	/** @param {string} positionId */
	const toggle = (positionId) => {
		if (show === 'open') {
			if (expandedOpenPositions.includes(positionId)) {
				expandedOpenPositions = expandedOpenPositions.filter((id) => id !== positionId);
			} else {
				expandedOpenPositions = [...expandedOpenPositions, positionId];
			}
		} else if (show === 'closed') {
			if (expandedClosedPositions.includes(positionId)) {
				expandedClosedPositions = expandedClosedPositions.filter((id) => id !== positionId);
			} else {
				expandedClosedPositions = [...expandedClosedPositions, positionId];
			}
		}
	};

	$: isExpanded = (/** @type {string} */ positionId) => {
		if (show === 'open') {
			return expandedOpenPositions.includes(positionId);
		} else if (show === 'closed') {
			return expandedClosedPositions.includes(positionId);
		}
		return false;
	};
</script>

<div class="flex flex-col">
	<div class="flex py-2">
		<div class="pl-2 w-1/6">Type</div>
		<div class="w-1/6 text-right">Leverage</div>
		<div class="w-1/6 text-right">Collateral</div>
		<div class="w-1/6 text-right">Entry Price</div>
		{#if show === 'open'}
			<div class="w-1/6 text-right">Liquidation Price</div>
			<div class="w-1/6 text-right">Take Profit Price</div>
		{:else if show === 'closed'}
			<div class="w-1/6 text-right">Close Price</div>
			<div class="w-1/6 text-right">PnL</div>
		{/if}
	</div>

	{#each positions as position, index (position.id)}
		<div
			class={`flex flex-col cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 ${
				index % 2 == 0 ? 'dark:bg-slate-800 dark:bg-opacity-50' : ''
			}`}
			on:click={() => toggle(position.id)}
			on:keypress={() => toggle(position.id)}
			transition:slide
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
					<div class="w-1/6 text-right">
						<span
							class={`font-extrabold ${
								position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
							}`}>{formatPercentage(position.pnlSharesPercentage)}</span
						>
					</div>
				{/if}
			</div>

			{#if isExpanded(position.id)}
				<div class="flex py-2 bg-gray-100 dark:bg-slate-800 dark:bg-opacity-50" transition:slide>
					<div class="pl-2 w-1/2">
						<span class="info-label">Opened:</span>
						{new Date(position.openDate * 1000).toLocaleString()}
						{#if !position.isOpen}
							<br />
							<span class="info-label">Closed:</span>
							{new Date(position.closeDate * 1000).toLocaleString()}
						{/if}
					</div>
					{#if position.isOpen}
						<div class="w-1/2 text-right">
							<span
								class={`font-extrabold ${
									position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
								}`}>{formatPercentage(position.pnlSharesPercentage)}</span
							>
						</div>
					{:else}
						<div class="w-1/2 text-right">
							<span class="info-label">Asset PnL:</span>
							<span
								class={`font-extrabold ${
									position.pnlAssetsPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
								}`}>{formatPercentage(position.pnlAssetsPercentage)}</span
							>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/each}
</div>
