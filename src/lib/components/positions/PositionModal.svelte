<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import {
		leverageDecimals,
		liquidityPoolDecimals,
		priceFeedDecimals,
		usdcDecimals
	} from '$lib/config/constants';
	import { liquidityPoolRatio } from '$lib/stores/liquidityPool';
	import { currentPriceTweened } from '$lib/stores/priceFeed';
	import { formatPercentage, formatValue } from '$lib/utils/format';
	dayjs.extend(relativeTime);

	/** @type {import("$lib/utils/position").Position} */
	export let position;

	// These values are always available
	$: openSharePrice =
		(position.collateral * 10n ** BigInt(liquidityPoolDecimals)) / position.shares;
	$: currentSharePrice = 10n ** 18n / $liquidityPoolRatio;

	$: currentAssetPnl = position.payoutShares / $liquidityPoolRatio - position.collateral;
	$: currentAssetPnlPercentage = Number((currentAssetPnl * 10000n) / position.collateral) / 100;

	// These values are only available when the position is closed
	$: closeSharePrice = position.isOpen ? 0n : 10n ** 18n / position.closeLpRatio;
	$: console.log(position);
</script>

<div>
	<div class="box-head">
		<h2>Position {position.id}</h2>
	</div>
	<div class="my-2 p-6 px-3 md:px-6 text-sm">
		<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
			<div class=" info-label">
				Opened <span class="text-xs">
					{dayjs.unix(position.openDate).fromNow()}
				</span>
			</div>
			<div class="info-label">
				{dayjs.unix(position.openDate).format('DD.MM.YY HH:mm')}
			</div>
		</div>

		<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
			<div class="info-label">Direction</div>
			<div class=" ">
				<span class={` ${position.isLong ? 'text-green-600' : 'text-red-700'}`}
					>{position.isLong ? 'LONG' : 'SHORT'}</span
				>
			</div>
		</div>

		<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
			<div class=" info-label">Leverage</div>
			<div class=" info-label">
				{formatValue(position.leverage, leverageDecimals, 0, { showSymbol: false })}x
			</div>
		</div>

		<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
			<div class=" info-label">Entry Price</div>
			<div class="info-label">
				{formatValue(position.entryPrice, priceFeedDecimals)}
			</div>
		</div>

		<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between text-xs">
			<div class=" info-label-secondary">Take Profit Price</div>
			<div class="info-label-secondary">
				{formatValue(position.takeProfitPrice, priceFeedDecimals)}
			</div>
		</div>

		<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between text-xs">
			<div class=" info-label-secondary">Liquidation Price</div>
			<div class="info-label-secondary">
				{formatValue(position.liquidationPrice, priceFeedDecimals)}
			</div>
		</div>

		<div
			class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between my-6 border-t dark:border-slate-500"
		/>

		<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
			<div class=" info-label">Collateral</div>
			<div class=" text-right">
				{formatValue(position.collateral, usdcDecimals)}
			</div>
		</div>

		<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
			<div class=" info-label">HYP Acquired</div>
			<div class="text-right">
				HYP {formatValue(position.shares, liquidityPoolDecimals, 2, { showSymbol: false })}
			</div>
		</div>

		<div
			class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between text-xs info-label-secondary"
		>
			<div class="">HYP/USDC</div>
			<div class="text-right">
				Price: {formatValue(openSharePrice, usdcDecimals)}
			</div>
		</div>

		<div
			class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between my-6 border-t dark:border-slate-500"
		/>

		{#if position.isOpen}
			<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
				<div class=" info-label">Current Price</div>
				<div class=" info-label">
					{formatValue($currentPriceTweened, priceFeedDecimals)}
				</div>
			</div>

			<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
				<div class=" info-label">Virtual PnL</div>
				<div class=" ">
					<span
						class={`${
							position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
						}`}>{formatPercentage(position.pnlSharesPercentage)}</span
					>
				</div>
			</div>

			<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
				<div class=" info-label">HYP Payout</div>
				<div class=" ">
					<span>
						HYP {formatValue(position.payoutShares, liquidityPoolDecimals, 2, {
							showSymbol: false
						})}
					</span>
				</div>
			</div>

			<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
				<div class=" info-label">
					Current Value<br />
				</div>
				<div class=" ">
					<span>{formatValue(position.payoutAssets, usdcDecimals)}</span>
				</div>
			</div>

			<div
				class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between text-xs info-label-secondary"
			>
				<div class="">HYP/USDC</div>
				<div class="text-right">
					Price: {formatValue(currentSharePrice, usdcDecimals)}
				</div>
			</div>
		{:else}
			<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
				<div class=" info-label">
					Closed <span class="text-xs">
						{dayjs.unix(position.closeDate).fromNow()}
					</span>
				</div>
				<div class="info-label">
					{dayjs.unix(position.closeDate).format('DD.MM.YY HH:mm')}
				</div>
			</div>

			<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
				<div class=" info-label">Close Price</div>
				<div class="info-label">
					{formatValue(position.closePrice, priceFeedDecimals)}
				</div>
			</div>

			<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
				<div class=" info-label">
					Payout
					<span
						class={`text-xs ${
							position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
						}`}
					>
						({formatPercentage(position.pnlSharesPercentage)})
					</span>
				</div>

				<div class="info-label">
					HYP {formatValue(position.payoutShares, liquidityPoolDecimals, 2, { showSymbol: false })}
				</div>
			</div>

			<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between">
				<div class=" info-label">Value at Close</div>
				<div class="info-label">
					{formatValue(position.payoutAssets, usdcDecimals)}
				</div>
			</div>

			<div
				class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between text-xs info-label-secondary"
			>
				<div class="">HYP/USDC</div>
				<div class="text-right">
					Price: {formatValue(closeSharePrice, usdcDecimals)}
				</div>
			</div>

			<div
				class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between my-6 border-t dark:border-slate-500"
			/>

			<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between font-semibold">
				<div class=" info-label">Total PnL</div>
				<div
					class={` ${
						position.pnlAssetsPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
					}`}
				>
					{formatValue(position.pnlAssets, usdcDecimals)}
					<span>
						({formatPercentage(position.pnlAssetsPercentage)})
					</span>
				</div>
			</div>
		{/if}
		{#if $liquidityPoolRatio > 0 && (position.isOpen || position.pnlShares > 0)}
			<div
				class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between my-6 border-t dark:border-slate-500"
			/>

			<div class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between text-xs">
				<div class=" info-label">Hypothetical current PnL</div>
				<div
					class={`text-right ${currentAssetPnl >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'}`}
				>
					{formatValue(
						position.payoutShares / $liquidityPoolRatio - position.collateral,
						usdcDecimals
					)}

					<span>
						({formatPercentage(currentAssetPnlPercentage)})
					</span>
				</div>
			</div>

			<div
				class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between text-xs info-label-secondary"
			>
				<div class="">HYP/USDC</div>
				<div class="text-right">
					Price: {formatValue(currentSharePrice, usdcDecimals)}
				</div>
			</div>
		{/if}
	</div>
</div>
