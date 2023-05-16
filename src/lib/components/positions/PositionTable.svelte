<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { leverageDecimals, priceFeedDecimals, usdcDecimals } from '$lib/config/constants';
	import { formatPercentage, formatValue } from '$lib/utils/format';
	import { slide } from 'svelte/transition';
	import { positionDetailsModal } from '$lib/stores/positionDetailsModal';
	/** @typedef {import('$lib/utils/position').Position} Position */

	dayjs.extend(relativeTime);

	/** @type {Position[]} */
	export let positions;
	/** @type {string} */
	export let show;

	const openPositionModal = (/** @type {Position}*/ position) => {
		positionDetailsModal.open(position);
	};
</script>

<div class="">
	<!-- Medium and Large Table Head -->
	<div class="hidden md:flex py-5 font-semibold info-label">
		<div class="pl-3 w-1/6">Type</div>
		<div class="w-1/6 text-right">Leverage</div>
		<div class="w-1/6 text-right">Collateral</div>
		<div class="w-1/6 text-right">Entry Price</div>
		{#if show === 'open'}
			<div class="w-1/6 text-right hidden md:block">Liquidation Price</div>
			<div class="w-1/6 text-right hidden md:block pr-3">Take Profit Price</div>
		{:else if show === 'closed'}
			<div class="w-1/6 text-right">Close Price</div>
			<div class="w-1/6 text-right pr-3">PnL</div>
		{/if}
	</div>

	<!-- Mobile Table Head -->
	<div class="flex md:hidden py-3 text-sm font-semibold info-label">
		<div class="pl-1 w-1/3">Dir. Lev.<br />Collateral</div>
		<div class="w-1/3 text-right">Open Price</div>
		{#if show === 'open'}
			<div class="w-1/3 text-right pr-1">Open Date<br />PNL</div>
		{:else if show === 'closed'}
			<div class="w-1/3 pr-1 text-right">Close Date<br />PNL</div>
		{/if}
	</div>

	<!-- Scroll Container -->
	<div
		class="overflow-auto h-[500px] w-full shadow-[inset_0_-24px_32px_-24px_rgba(2,6,23,0.5),inset_0_24px_32px_-24px_rgba(2,6,23,0.5)]"
	>
		{#each positions as position, index (position.id)}
			<div
				class={`flex flex-col rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 ${
					index % 2 == 0 ? 'dark:bg-slate-800 dark:bg-opacity-50' : ''
				}`}
				on:click={() => openPositionModal(position)}
				on:keypress={() => openPositionModal(position)}
				transition:slide|local
			>
				<div class="py-2 hidden md:flex">
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
							<span class="font-mono">
								{formatValue(position.liquidationPrice, priceFeedDecimals, 2)}
							</span>
						</div>
						<div class="w-1/6 text-right pr-3">
							<span class="font-mono">
								{formatValue(position.takeProfitPrice, priceFeedDecimals, 2)}
							</span>
						</div>
					{:else}
						<div class="w-1/6 text-right">
							<span class="font-mono">{formatValue(position.closePrice, priceFeedDecimals, 2)}</span
							>
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

				<!-- Mobile View -->
				<div class="py-2 flex md:hidden text-sm">
					<div class="pl-1 w-1/3">
						<span class={`font-bold ${position.isLong ? 'text-green-600' : 'text-red-700'}`}>
							{position.isLong ? 'L' : 'S'}
						</span>
						<span class="font-mono">
							{formatValue(position.leverage, leverageDecimals, 0, { showSymbol: false })}x
						</span>

						<br />

						<span class="font-mono">{formatValue(position.collateral, usdcDecimals, 0)}</span>
					</div>

					<div class="w-1/3 text-right">
						<span class="font-mono info-label text-sm"
							>{formatValue(position.entryPrice, priceFeedDecimals, 0)}</span
						>
					</div>

					<div class="w-1/3 text-right pr-1">
						<span class="text-sm info-label"
							>{dayjs
								.unix(position.isOpen ? position.openDate : position.closeDate)
								.fromNow()}</span
						>
						<span
							class={`font-semibold ${
								position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
							}`}>{formatPercentage(position.pnlSharesPercentage, { decimals: 0 })}</span
						>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
