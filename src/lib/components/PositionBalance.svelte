<script>
	import { liquidityPoolDecimals, usdcDecimals } from '$lib/config/constants';
	import { positionBalance } from '$lib/stores/positionBalance';
	import { formatPercentage, formatValue } from '$lib/utils/format';
	import { formatUnits } from 'ethers/lib/utils.js';

	$: console.log($positionBalance);
</script>

<div class="p-6">
	{#if $positionBalance.loading}
		<p>Loading position balance.</p>
	{:else if $positionBalance.error}
		<p>Error: {$positionBalance.error.message}</p>
	{:else}
		<h2 class="font-semibold info-label font-heading mb-3">Share Distribution:</h2>
		<div class="relative bg-gray-200 rounded h-8">
			<div
				class="absolute font-semibold left-0 h-full bg-green-600 text-white text-xs text-left leading-8 px-2"
				style={`width: ${$positionBalance.longSharesPercentage}%`}
			>
				<span class="font-normal opacity-70">LONG:</span>
				{formatUnits($positionBalance.longShares, liquidityPoolDecimals)}
				({$positionBalance.longSharesPercentage.toFixed(2)}%)
			</div>
			<div
				class="absolute font-semibold right-0 h-full bg-red-600 text-white text-xs text-right leading-8 px-2"
				style={`width: ${$positionBalance.shortSharesPercentage}%`}
			>
				<span class="font-normal opacity-70">SHORT:</span>
				{formatUnits($positionBalance.shortShares, liquidityPoolDecimals)}
				({$positionBalance.shortSharesPercentage.toFixed(2)}%)
			</div>
		</div>
		<h2 class="font-semibold info-label font-heading mb-3 mt-9">USDC Distribution:</h2>
		<div class="relative bg-gray-200 rounded h-8">
			<div
				class="absolute font-semibold left-0 h-full bg-green-600 text-white text-xs text-left leading-8 px-2"
				style={`width: ${$positionBalance.longCollateralPercentage}%`}
			>
				<span class="font-normal opacity-70">LONG:</span>
				{formatValue($positionBalance.longCollateral, usdcDecimals)}
				({$positionBalance.longCollateralPercentage.toFixed(2)}%)
			</div>
			<div
				class="absolute font-semibold right-0 h-full bg-red-600 text-white text-xs text-right leading-8 px-2"
				style={`width: ${$positionBalance.shortCollateralPercentage}%`}
			>
				<span class="font-normal opacity-70">SHORT:</span>
				{formatValue($positionBalance.shortCollateral, usdcDecimals)}
				({$positionBalance.shortCollateralPercentage.toFixed(2)}%)
			</div>
		</div>
	{/if}
</div>
