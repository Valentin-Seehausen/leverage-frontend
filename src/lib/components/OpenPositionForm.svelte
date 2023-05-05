<script>
	import { openPosition } from '$lib/stores/tradePair';
	import { increaseAllowance } from '$lib/stores/usdc';

	let collateral = 100;
	let leverage = 2;
	let isLong = true;

	let currentPrice = 20000;
	$: takeProfitPrice = currentPrice * (1 + 1 / leverage);
	$: liquidationPrice = currentPrice * (1 - 1 / leverage);
	const handleSubmit = async () => {
		await (await increaseAllowance(collateral)).wait();
		await openPosition(collateral, leverage, isLong);
	};
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
		<span class="info-label">Collateral</span>
		<input class="user-input" type="text" bind:value={collateral} />
	</label>
	<label class="block">
		<span class="info-label text-sm">Leverage</span>
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

	<button on:click={handleSubmit} class="user-button w-full mt-6">Open Position</button>
</div>
