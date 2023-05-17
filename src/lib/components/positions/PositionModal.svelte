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

	$: currentAssetPnl = position.payoutShares / $liquidityPoolRatio - position.collateral;
	$: currentAssetPnlPercentage = Number((currentAssetPnl * 10000n) / position.collateral) / 100;
	$: openSharePrice =
		(position.collateral * 10n ** BigInt(liquidityPoolDecimals)) / position.shares;
	$: closeSharePrice = 10n ** 18n / position.closeLpRatio;
	$: currentSharePrice = 10n ** 18n / $liquidityPoolRatio;
</script>

<div>
	<div class="box-head dark:bg-valhalla-300/10 w-full m-0 p-6 py-4">
		<h2>Position {position.id}</h2>
	</div>
	<div class="my-2 p-6 px-2 md:px-6 text-sm">
		<div class="flex flex-row justify-between">
			<div class="info-label">Direction:</div>
			<div class=" ">
				<span class={` ${position.isLong ? 'text-green-600' : 'text-red-700'}`}
					>{position.isLong ? 'LONG' : 'SHORT'}</span
				>
			</div>
		</div>

		<div class="flex flex-row justify-between">
			<div class=" info-label">Leverage:</div>
			<div class=" ">
				{formatValue(position.leverage, leverageDecimals, 0, { showSymbol: false })}x
			</div>
		</div>

		<div class="flex flex-row justify-between">
			<div class=" info-label">Collateral:</div>
			<div class=" ">
				{formatValue(position.collateral, usdcDecimals)}
			</div>
		</div>

		<div class="flex flex-row justify-between">
			<div class=" info-label">Take Profit Price:</div>
			<div class="info-label">
				{formatValue(position.takeProfitPrice, priceFeedDecimals)}
			</div>
		</div>

		<div class="flex flex-row justify-between">
			<div class=" info-label">Liquidation Price:</div>
			<div class="info-label">
				{formatValue(position.liquidationPrice, priceFeedDecimals)}
			</div>
		</div>

		<div class="flex flex-row justify-between my-6 border-t dark:border-slate-500" />

		<div class="flex flex-row justify-between">
			<div class=" info-label">
				Opened <span class="text-xs">
					{dayjs.unix(position.openDate).fromNow()}
				</span>
			</div>
			<div class="info-label">
				{dayjs.unix(position.openDate).format('DD.MM.YY HH:mm')}
			</div>
		</div>

		<div class="flex flex-row justify-between">
			<div class=" info-label">At Entry Price:</div>
			<div class="info-label">
				{formatValue(position.entryPrice, priceFeedDecimals)}
			</div>
		</div>

		<div class="flex flex-row justify-between">
			<div class=" info-label">Provided Collateral:</div>
			<div class=" ">
				{formatValue(position.collateral, usdcDecimals)}
			</div>
		</div>

		<div class="flex flex-row justify-between">
			<div class=" info-label">
				Swapped for (price: {formatValue(openSharePrice, usdcDecimals)}):
			</div>
			<div class="">
				{formatValue(position.shares, liquidityPoolDecimals, 2, { showSymbol: false })} HYP
			</div>
		</div>

		<div class="flex flex-row justify-between my-6 border-t dark:border-slate-500" />

		{#if position.isOpen}
			<div class="flex flex-row justify-between">
				<div class=" info-label">Current Price:</div>
				<div class=" ">
					{formatValue($currentPriceTweened, priceFeedDecimals)}
				</div>
			</div>

			<div class="flex flex-row justify-between">
				<div class=" info-label">Current Shares PNL:</div>
				<div class=" ">
					<span
						class={`font-extrabold ${
							position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
						}`}>{formatPercentage(position.pnlSharesPercentage)}</span
					>
				</div>
			</div>
		{:else}
			<div class="flex flex-row justify-between">
				<div class=" info-label">
					Closed <span class="text-xs">
						{dayjs.unix(position.closeDate).fromNow()}
					</span>
				</div>
				<div class="info-label">
					{dayjs.unix(position.closeDate).format('DD.MM.YY HH:mm')}
				</div>
			</div>

			<div class="flex flex-row justify-between">
				<div class=" info-label">At Close Price</div>
				<div class="info-label">
					{formatValue(position.closePrice, priceFeedDecimals)}
				</div>
			</div>

			<div class="flex flex-row justify-between">
				<div class=" info-label">
					Received
					<span
						class={`text-xs ${
							position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
						}`}
					>
						({formatPercentage(position.pnlSharesPercentage)})
					</span>
				</div>

				<div class="info-label">
					{formatValue(position.payoutShares, liquidityPoolDecimals, 2)} HYP
				</div>
			</div>

			<div class="flex flex-row justify-between">
				<div class=" info-label">
					At close price ({formatValue(closeSharePrice, usdcDecimals)}) worth:
				</div>
				<div class="info-label">
					{formatValue(position.payoutAssets, usdcDecimals)}
				</div>
			</div>

			<div class="flex flex-row justify-between my-6 border-t dark:border-slate-500" />

			<div class="flex flex-row justify-between font-semibold">
				<div class=" info-label">Total PNL</div>
				<div
					class={` ${
						position.pnlAssetsPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
					}`}
				>
					{formatValue(position.pnlAssets, usdcDecimals)}
					(<span>
						{formatPercentage(position.pnlAssetsPercentage)}
					</span>)
				</div>
			</div>

			{#if $liquidityPoolRatio > 0 && position.pnlShares > 0}
				<div class="flex flex-row justify-between my-6 border-t dark:border-slate-500" />

				<div class="flex flex-row justify-between text-xs">
					<div class=" info-label">
						Hypothetical PNL at current price ({formatValue(currentSharePrice, usdcDecimals)})
					</div>
					<div
						class={`text-right ${
							currentAssetPnl >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
						}`}
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
			{/if}
		{/if}
	</div>
</div>
