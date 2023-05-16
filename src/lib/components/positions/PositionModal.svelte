<script>
	import {
		leverageDecimals,
		liquidityPoolDecimals,
		priceFeedDecimals,
		usdcDecimals
	} from '$lib/config/constants';
	import { liquidityPoolRatio } from '$lib/stores/liquidityPool';
	import { currentPriceTweened } from '$lib/stores/priceFeed';
	import { formatPercentage, formatValue } from '$lib/utils/format';

	/** @type {import("$lib/utils/position").Position} */
	export let position;
</script>

<div>
	<h2>Position Details</h2>

	<div class="my-6 px-2">
		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Direction:</div>
			<div class="basis-1/3 text-right">
				<span class={` ${position.isLong ? 'text-green-600' : 'text-red-700'}`}
					>{position.isLong ? 'LONG' : 'SHORT'}</span
				>
			</div>
		</div>

		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Leverage:</div>
			<div class="basis-1/3 text-right">
				{formatValue(position.leverage, leverageDecimals, 0, { showSymbol: false })}x
			</div>
		</div>

		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Collateral:</div>
			<div class="basis-1/3 text-right">
				{formatValue(position.collateral, usdcDecimals)}
			</div>
		</div>

		<div class="flex flex-row">
			<div class="basis-2/3 info-label">LP Shares:</div>
			<div class="basis-1/3 text-right">
				{formatValue(position.shares, liquidityPoolDecimals, 2, { showSymbol: false })}
			</div>
		</div>

		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Opened:</div>
			<div class="basis-1/3 text-right">
				{new Date(position.openDate * 1000).toLocaleString()}
			</div>
		</div>

		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Entry Price:</div>
			<div class="basis-1/3 text-right">
				{formatValue(position.entryPrice, priceFeedDecimals)}
			</div>
		</div>

		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Take Profit Price:</div>
			<div class="basis-1/3 text-right">
				{formatValue(position.takeProfitPrice, priceFeedDecimals)}
			</div>
		</div>

		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Liquidation Price:</div>
			<div class="basis-1/3 text-right">
				{formatValue(position.liquidationPrice, priceFeedDecimals)}
			</div>
		</div>

		<div class="flex flex-row my-6 border-t dark:border-slate-500" />

		{#if position.isOpen}
			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Current Price:</div>
				<div class="basis-1/3 text-right">
					{formatValue($currentPriceTweened, priceFeedDecimals)}
				</div>
			</div>

			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Current Shares PNL:</div>
				<div class="basis-1/3 text-right">
					<span
						class={`font-extrabold ${
							position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
						}`}>{formatPercentage(position.pnlSharesPercentage)}</span
					>
				</div>
			</div>
		{:else}
			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Closed:</div>
				<div class="basis-1/3 text-right">
					{new Date(position.closeDate * 1000).toLocaleString()}
				</div>
			</div>

			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Close Price:</div>
				<div class="basis-1/3 text-right">
					{formatValue(position.closePrice, priceFeedDecimals)}
				</div>
			</div>

			<div class="flex flex-row">
				<div class="basis-2/3 info-label">PNL Shares:</div>
				<div class="basis-1/3 text-right">
					{formatValue(position.pnlShares, liquidityPoolDecimals, 2, { showSymbol: false })}
				</div>
			</div>

			<div class="flex flex-row">
				<div class="basis-2/3 info-label">PNL Assets:</div>
				<div class="basis-1/3 text-right">
					{formatValue(position.pnlAssets, usdcDecimals)}
				</div>
			</div>

			{#if $liquidityPoolRatio > 0 && position.pnlShares > 0}
				<div class="flex flex-row">
					<div class="basis-2/3 info-label">Current Value:</div>
					<div class="basis-1/3 text-right">
						{formatValue(position.pnlShares / $liquidityPoolRatio, usdcDecimals)}
					</div>
				</div>
			{/if}

			<div class="flex flex-row">
				<div class="basis-2/3 info-label">PNL Shares Percentage:</div>
				<div class="basis-1/3 text-right">
					<span
						class={`font-extrabold ${
							position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
						}`}>{formatPercentage(position.pnlSharesPercentage)}</span
					>
				</div>
			</div>

			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Absolute PNL Assets:</div>
				<div class="basis-1/3 text-right">
					<span
						class={`font-extrabold ${
							position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
						}`}
						>{formatPercentage(
							Number((position.pnlShares * 10000n) / $liquidityPoolRatio / position.collateral) /
								100
						)}</span
					>
				</div>
			</div>
		{/if}
	</div>
</div>
