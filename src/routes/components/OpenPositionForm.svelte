<script>
	let collateral = 100;
	let leverage = 2;

	let currentPrice = 20000;
	$: takeProfitPrice = currentPrice * (1 + 1 / leverage);
	$: liquidationPrice = currentPrice * (1 - 1 / leverage);
</script>

<div class="p-6">
	<label class="block mb-6">
		<span class="block text-sm font-medium text-slate-700">Collateral</span>
		<input
			class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
			type="text"
			bind:value={collateral}
		/>
	</label>
	<label class="block">
		<span class="block text-sm font-medium text-slate-700">Leverage</span>
		<input
			class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
			type="text"
			bind:value={leverage}
		/>
	</label>

	<div class="mt-6 mb-6 md:max-lg:px-2 px-6">
		<div class="flex flex-row">
			<div class="basis-2/3">Take Profit Price:</div>
			<div class="basis-1/3">{takeProfitPrice}</div>
		</div>
		<div class="flex flex-row">
			<div class="basis-2/3">Entry Price:</div>
			<div class="basis-1/3">{currentPrice}</div>
		</div>
		<div class="flex flex-row">
			<div class="basis-2/3">Liquidation Price:</div>
			<div class="basis-1/3">{liquidationPrice}</div>
		</div>
	</div>

	<button
		class="mt-6 block w-full px-3 py-2 bg-slate-700 text-slate-100 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500">Open Position</button
	>
</div>
