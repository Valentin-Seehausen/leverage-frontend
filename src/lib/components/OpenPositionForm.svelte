<script>
	import { openPosition } from '$lib/stores/tradePair';
	import { increaseAllowance } from '$lib/stores/usdc';

	let collateral = 100;
	let leverage = 2;

	let currentPrice = 20000;
	$: takeProfitPrice = currentPrice * (1 + 1 / leverage);
	$: liquidationPrice = currentPrice * (1 - 1 / leverage);
	const handleSubmit = async () => {
		await (await increaseAllowance(collateral)).wait();
		await openPosition(collateral, leverage, true);
	};
</script>

<div class="box">
	<label class="block mb-6">
		<span class="block text-sm font-medium text-slate-700 dark:text-slate-50 info-label"
			>Collateral</span
		>
		<input class="user-input" type="text" bind:value={collateral} />
	</label>
	<label class="block">
		<span class="block text-sm font-medium text-slate-700 dark:text-slate-50 info-label"
			>Leverage</span
		>
		<input class="user-input" type="text" bind:value={leverage} />
	</label>

	<div class="my-6 md:max-lg:px-2 px-2">
		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Take Profit Price:</div>
			<div class="basis-1/3 text-right">{takeProfitPrice}</div>
		</div>
		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Entry Price:</div>
			<div class="basis-1/3 text-right">{currentPrice}</div>
		</div>
		<div class="flex flex-row">
			<div class="basis-2/3 info-label">Liquidation Price:</div>
			<div class="basis-1/3 text-right">{liquidationPrice}</div>
		</div>
	</div>

	<button on:click={handleSubmit} class="user-button">Open Position</button>
</div>
