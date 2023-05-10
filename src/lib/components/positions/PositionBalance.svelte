<script>
	import { liquidityPoolDecimals } from '$lib/config/constants';
	import { positionBalance } from '$lib/stores/positionBalance';
	import { formatValue } from '$lib/utils/format';
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
				class="absolute font-semibold left-0 h-full bg-green-700 text-white text-xs text-left leading-8 px-2 transition-all duration-1000"
				style={`width: ${$positionBalance.longSharesPercentage}%`}
			>
				{$positionBalance.longSharesPercentage.toFixed(2)}%
			</div>

			<div
				class="absolute font-semibold right-0 h-full bg-red-700 text-white text-xs text-right leading-8 px-2 transition-all duration-1000"
				style={`width: ${$positionBalance.shortSharesPercentage}%`}
			>
				{$positionBalance.shortSharesPercentage.toFixed(2)}%
			</div>
		</div>

		<div class="flex flex-row mt-3">
			<div class="info-label">Long:</div>
			<div class="grow text-right">
				{formatValue($positionBalance.longShares, liquidityPoolDecimals, 2, { showSymbol: false })}
			</div>
		</div>
		<div class="flex flex-row">
			<div class="info-label">Short:</div>
			<div class="grow text-right">
				{formatValue($positionBalance.shortShares, liquidityPoolDecimals, 2, { showSymbol: false })}
			</div>
		</div>
	{/if}
</div>
