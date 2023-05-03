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

<div class="p-3 border rounded dark:border-slate-700 dark:bg-slate-800">
	<label class="block mb-6">
		<span class="block text-sm font-medium text-slate-700 dark:text-slate-50 info-label"
			>Collateral</span
		>
		<input
			class="dark:bg-slate-700 dark:border-slate-600 font-sans dark:text-white mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:focus:ring-sky-700 dark:focus:border-sky-700
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
			type="text"
			bind:value={collateral}
		/>
	</label>
	<label class="block">
		<span class="block text-sm font-medium text-slate-700 dark:text-slate-50 info-label"
			>Leverage</span
		>
		<input
			class="dark:bg-slate-700 dark:border-slate-600 font-sans dark:text-white mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:focus:ring-sky-700 dark:focus:border-sky-700
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
			type="text"
			bind:value={leverage}
		/>
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

	<button
		on:click={handleSubmit}
		class="mt-6 block w-full px-3 py-2 bg-slate-700 text-slate-100 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500 font-bold">Open Position</button
	>
</div>
