<script>
	import { liquidityPoolDecimals } from '$lib/config/constants';
	import { positionBalance } from '$lib/stores/positionBalance';
	import { formatValue } from '$lib/utils/format';
	import { interpolateBigInts as interpolate } from '$lib/utils/interpolateBigInts';
	import { sineInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const longSharesTweened = tweened(0n, { duration: 200, easing: sineInOut, interpolate });

	const shortSharesTweened = tweened(0n, { duration: 200, easing: sineInOut, interpolate });

	const longSharesPercentageTweened = tweened(0, { duration: 200, easing: sineInOut });
	const shortSharesPercentageTweened = tweened(0, { duration: 200, easing: sineInOut });

	$: {
		longSharesTweened.set($positionBalance.longShares);
		shortSharesTweened.set($positionBalance.shortShares);

		longSharesPercentageTweened.set($positionBalance.longSharesPercentage);
		shortSharesPercentageTweened.set($positionBalance.shortSharesPercentage);
	}
</script>

<div class="p-6">
	{#if $positionBalance.loading}
		<p>Loading position balance.</p>
	{:else if $positionBalance.error}
		<p>Error: {$positionBalance.error.message}</p>
	{:else}
		<h2 class="font-semibold info-label font-heading mb-3">Share Distribution:</h2>

		<div class="relative dark:bg-slate-600 rounded h-8">
			<div
				class="absolute font-semibold left-0 h-full bg-green-700 text-white text-xs text-left leading-8 px-2"
				style={`width: ${$longSharesPercentageTweened}%`}
			>
				{$longSharesPercentageTweened.toFixed(2)}%
			</div>

			<div
				class="absolute font-semibold right-0 h-full bg-red-700 text-white text-xs text-right leading-8 px-2"
				style={`width: ${$shortSharesPercentageTweened}%`}
			>
				{$shortSharesPercentageTweened.toFixed(2)}%
			</div>
		</div>

		<div class="flex flex-row mt-3">
			<div class="info-label">Long:</div>
			<div class="grow text-right">
				{formatValue($longSharesTweened, liquidityPoolDecimals, 2, { showSymbol: false })}
			</div>
		</div>
		<div class="flex flex-row">
			<div class="info-label">Short:</div>
			<div class="grow text-right">
				{formatValue($shortSharesTweened, liquidityPoolDecimals, 2, { showSymbol: false })}
			</div>
		</div>
	{/if}
</div>
