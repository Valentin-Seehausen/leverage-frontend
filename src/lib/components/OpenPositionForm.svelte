<script>
	import {
		leverageDecimals,
		liquidityPoolDecimals,
		minCollateral,
		priceFeedDecimals,
		usdcDecimals
	} from '$lib/config/constants';
	import { openPosition } from '$lib/stores/tradePair';
	import { userUsdc } from '$lib/stores/usdc';
	import { currentPriceTweened } from '$lib/stores/priceFeed';
	import { formatValue } from '$lib/utils/format';
	import { parseUnits } from 'viem';
	import { slide } from 'svelte/transition';
	import {
		previewLongMultiplier,
		previewShortMultiplier,
		previewPosition,
		previewShares
	} from '$lib/stores/previewPosition';
	import { onDestroy } from 'svelte';
	import { liquidityPoolPrice } from '$lib/stores/liquidityPool';
	import { positionBalance } from '$lib/stores/positionBalance';

	let inputCollateral = '';
	$: inputCollateral = inputCollateral.replace(/[^0-9]/g, '');
	// @ts-ignore
	$: collateral = BigInt(parseUnits(inputCollateral, usdcDecimals)) || 0n;
	$: previewPosition.set({ collateral, isLong });
	let leverage = 5;
	let isLong = true;

	$: maxClosePrice =
		($currentPriceTweened * parseUnits('1', leverageDecimals)) /
			// @ts-ignore
			parseUnits(leverage.toString(), leverageDecimals) +
		$currentPriceTweened;
	$: minClosePrice =
		($currentPriceTweened * parseUnits('1', leverageDecimals)) /
			// @ts-ignore
			parseUnits(leverage.toString(), leverageDecimals) -
		$currentPriceTweened * -1n;
	$: takeProfitPrice = isLong ? maxClosePrice : minClosePrice;
	$: liquidationPrice = isLong ? minClosePrice : maxClosePrice;

	const handleSubmit = () => {
		openPosition(collateral, leverage, isLong);
	};

	$: allowanceIsSufficient = $userUsdc.allowance >= collateral;
	$: balanceIsSufficient = $userUsdc.balance >= collateral;

	onDestroy(() => {
		previewPosition.set({ collateral: 0n, isLong: true });
	});
</script>

<div class="box">
	<div class="box-head">
		<h2>Open Position</h2>
	</div>
	<div class="box-content">
		<div class="flex w-full mb-6 md:mb-9">
			<button
				class={`flex-1 text-sm font-semibold py-2 px-4 active:bg-green-700 focus:bg-green-700 transition-all ${
					isLong ? 'bg-green-700' : 'bg-slate-700'
				} dark:text-slate-100 rounded-l`}
				on:click={() => (isLong = true)}
			>
				Long
			</button>
			<button
				class={`flex-1 text-sm font-semibold py-2 px-4 active:bg-red-700 focus:bg-red-700 transition-all ${
					!isLong ? 'bg-red-700' : 'bg-slate-700'
				} dark:text-slate-100 rounded-r`}
				on:click={() => (isLong = false)}
			>
				Short
			</button>
		</div>

		<label class="block mb-6 md:mb-9 text-sm">
			<div class="flex content-between">
				<span class="info-label text-sm grow">Collateral</span>
				<button
					class="info-label text-sm opacity-50"
					on:click={() =>
						(inputCollateral = ($userUsdc.balance / 10n ** BigInt(usdcDecimals)).toString())}
				>
					Max: {formatValue($userUsdc.balance, usdcDecimals)}
				</button>
			</div>
			<input class="user-input" type="text" bind:value={inputCollateral} />
		</label>

		<label class="block mb-6 md:mb-9">
			<span class="info-label text-sm">Leverage {leverage}x {leverage === 100 ? '🦍' : ''}</span>
			<input
				class="pl-[4%] w-full bg-gradient-to-r from-gray-800 from-5% via-primary-700/80 via-5% to-secondary-600/50 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 dark:accent-slate-300"
				type="range"
				bind:value={leverage}
				min={5}
				max={100}
			/>
		</label>

		<div class="my-6 md:max-lg:px-2 px-2 text-sm">
			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Take Profit Price:</div>
				<div class="basis-1/3 text-right">{formatValue(takeProfitPrice, priceFeedDecimals)}</div>
			</div>
			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Entry Price:</div>
				<div class="basis-1/3 text-right">
					{formatValue($currentPriceTweened, priceFeedDecimals)}
				</div>
			</div>
			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Liquidation Price:</div>
				<div class="basis-1/3 text-right">{formatValue(liquidationPrice, priceFeedDecimals)}</div>
			</div>

			<div
				class="flex flex-row gap-9 sm:gap-16 md:gap-24 lg:gap-32 justify-between my-6 border-t dark:border-slate-500"
			/>

			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Minted HYP:</div>
				<div class="basis-1/3 text-right">
					HYP {formatValue($previewShares, liquidityPoolDecimals, 2, { showSymbol: false })}
				</div>
			</div>

			<div class="flex flex-row">
				<div class="basis-2/3 info-label">HYP/USDC:</div>
				<div class="basis-1/3 text-right">
					{formatValue($liquidityPoolPrice, usdcDecimals)}
				</div>
			</div>

			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Multiplier Effect:</div>
				<div class="basis-1/3 text-right">
					{#if isLong}
						{$positionBalance.longMultiplier.toFixed(2)} &rarr; {$previewLongMultiplier.toFixed(2)}
					{:else}
						{$positionBalance.shortMultiplier.toFixed(2)} &rarr; {$previewShortMultiplier.toFixed(
							2
						)}
					{/if}
				</div>
			</div>
		</div>

		{#if !balanceIsSufficient}
			<div transition:slide|local class="text-sm info-label text-center mt-6">
				You need {formatValue(collateral, usdcDecimals, 0)} USDC to open this position. Currently you
				only have {formatValue($userUsdc.balance, usdcDecimals, 0, {
					showSymbol: false
				})} USDC.
			</div>
		{:else if !allowanceIsSufficient}
			<div transition:slide|local class="text-sm info-label text-center mt-6">
				You need to increase your allowance to open this position.
			</div>
		{/if}

		{#if collateral < minCollateral}
			<div transition:slide|local class="text-sm info-label text-center mt-6">
				Minimum collateral is 100 USDC.
			</div>
		{/if}
	</div>

	<div class="box-action">
		<button on:click={handleSubmit} disabled={!balanceIsSufficient || collateral < minCollateral}>
			{#if !balanceIsSufficient}
				Not enough USDC
			{:else if !allowanceIsSufficient}
				Increase Allowance
			{:else}
				Open Position
			{/if}
		</button>
	</div>
</div>
