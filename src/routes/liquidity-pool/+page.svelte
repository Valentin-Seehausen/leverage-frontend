<script>
	import { slide } from 'svelte/transition';
	import { totalSupply, totalAssets, tradePairBalance } from '$lib/stores/liquidityPool';
	import { liquidityPoolDecimals, usdcPoolDecimals } from '$lib/config/constants';
	import { formatUnits } from 'ethers/lib/utils.js';

	let withdrawAmount = 0;

	let chooseMax = () => {
		withdrawAmount = 123;
	};
</script>

<div class="p-3 mb-3">
	<h1 class="headline">Liquidity Pool</h1>
</div>

<div class="box">
	<h2 class="font-heading mb-3">Total</h2>

	<div class="flex flex-row">
		<div class="basis-2/3 info-label">Assets:</div>
		<div class="basis-1/3 text-right">USDC {formatUnits($totalAssets, usdcPoolDecimals)}</div>
	</div>
	<div class="flex flex-row">
		<div class="basis-2/3 info-label">Shares:</div>
		<div class="basis-1/3 text-right">LP {formatUnits($totalSupply, liquidityPoolDecimals)}</div>
	</div>
	<div class="flex flex-row">
		<div class="basis-2/3 info-label">Outstanding:</div>
		<div class="basis-1/3 text-right">
			LP {formatUnits($tradePairBalance, liquidityPoolDecimals)}
		</div>
	</div>
</div>

<div class="box">
	<h2 class="mb-3">You</h2>

	<div class="flex">
		<div class="basis-2/3 info-label">Assets:</div>
		<div class="basis-1/3 text-right">USDC 123.00</div>
	</div>
	<div class="flex">
		<div class="basis-2/3 info-label">Shares:</div>
		<div class="basis-1/3 text-right">LP 123.00</div>
	</div>
</div>

<div class="p-3 my-3">
	<p class="info-label text-sm">
		You can always withdraw your shares. A protocol fee of 1% will apply to incentivice liquidity
		provision. The only way to provide liquidity is to profit from a successful trade. Only
		ex-traders can become liquidity providers.
	</p>
</div>

<div class="box">
	<label class="block">
		<div class="flex content-between">
			<span class="info-label text-sm grow">LP Amount</span>
			<button class="info-label text-sm opacity-50" on:click={chooseMax}>Max: 123.00</button>
		</div>
		<input class="user-input" type="text" bind:value={withdrawAmount} />
	</label>

	{#if withdrawAmount > 0}
		<div class="flex my-3" transition:slide>
			<div class="basis-2/3 info-label">Out:</div>
			<div class="basis-1/3 text-right">USDC {withdrawAmount}</div>
		</div>
	{/if}

	<button class="w-full user-button mt-6">Withdraw</button>
</div>
