<script>
	import { leverageDecimals, priceFeedDecimals, usdcDecimals } from '$lib/config/constants';
	import { openPosition } from '$lib/stores/tradePair';
	import { userUsdc } from '$lib/stores/usdc';
	import { currentPriceTweened } from '$lib/stores/priceFeed';
	import { formatValue } from '$lib/utils/format';
	import { parseUnits } from 'viem';

	let inputCollateral = '100';
	$: inputCollateral = inputCollateral.replace(/[^0-9]/g, '');
	// @ts-ignore
	$: collateral = BigInt(parseUnits(inputCollateral, usdcDecimals)) || 0n;
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
</script>

<div class="box">
	<h2 class="font-semibold font-heading mb-3">Open Position</h2>
	<div class="flex w-full mb-6">
		<button
			class={`flex-1 text-sm font-semibold py-2 px-4 active:bg-green-700 focus:bg-green-700 ${
				isLong ? 'bg-green-600' : 'bg-slate-700'
			} text-white rounded-l`}
			on:click={() => (isLong = true)}
		>
			Long
		</button>
		<button
			class={`flex-1 text-sm font-semibold py-2 px-4 active:bg-red-700 focus:bg-red-700 ${
				!isLong ? 'bg-red-600' : 'bg-slate-700'
			} text-white rounded-r`}
			on:click={() => (isLong = false)}
		>
			Short
		</button>
	</div>

	<label class="block mb-6 text-sm">
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

	<label class="block">
		<span class="info-label text-sm">Leverage {leverage}x {leverage === 100 ? '🦍' : ''}</span>
		<input
			class="pl-[4%] w-full bg-gradient-to-r from-slate-800 from-5% via-cyan-800 via-5% to-purple-800 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 dark:accent-slate-300"
			type="range"
			bind:value={leverage}
			min={5}
			max={100}
		/>
	</label>

	<div class="my-6 md:max-lg:px-2 px-2">
		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Take Profit Price:</div>
			<div class="basis-1/3 text-right">{formatValue(takeProfitPrice, priceFeedDecimals)}</div>
		</div>
		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Entry Price:</div>
			<div class="basis-1/3 text-right">{formatValue($currentPriceTweened, priceFeedDecimals)}</div>
		</div>
		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Liquidation Price:</div>
			<div class="basis-1/3 text-right">{formatValue(liquidationPrice, priceFeedDecimals)}</div>
		</div>
	</div>

	<button on:click={handleSubmit} class="user-button w-full mt-6" disabled={!balanceIsSufficient}>
		{#if !balanceIsSufficient}
			Not enough USDC
		{:else if !allowanceIsSufficient}
			Increase Allowance
		{:else}
			Open Position
		{/if}
	</button>

	{#if !balanceIsSufficient}
		<div class="text-sm info-label text-center mt-6 mb-3">
			You need {formatValue(collateral, usdcDecimals, 0)} USDC to open this position. Currently you only
			have {formatValue($userUsdc.balance, usdcDecimals, 0, {
				showSymbol: false
			})} USDC.
		</div>
	{:else if !allowanceIsSufficient}
		<div class="text-sm info-label text-center mt-6 mb-3">
			You need to increase your allowance to open this position.
		</div>
	{/if}
</div>
