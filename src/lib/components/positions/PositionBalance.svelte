<script>
	import { liquidityPoolDecimals } from '$lib/config/constants';
	import { positionBalance } from '$lib/stores/positionBalance';
	import {
		previewLongMultiplier,
		previewLongPercentage,
		previewPosition,
		previewShares,
		previewShortMultiplier
	} from '$lib/stores/previewPosition';
	import { formatValue } from '$lib/utils/format';
	import { interpolateBigInts as interpolate } from '$lib/utils/interpolateBigInts';
	import Chart from 'chart.js/auto';
	import { onDestroy } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const longSharesTweened = tweened(10n, { duration: 200, easing: sineInOut, interpolate });

	const shortSharesTweened = tweened(10n, { duration: 200, easing: sineInOut, interpolate });

	const longSharesPercentageTweened = tweened(50, { duration: 200, easing: sineInOut });
	const shortSharesPercentageTweened = tweened(50, { duration: 200, easing: sineInOut });

	$: {
		longSharesTweened.set($positionBalance.longShares);
		shortSharesTweened.set($positionBalance.shortShares);

		longSharesPercentageTweened.set($positionBalance.longSharesPercentage);
		shortSharesPercentageTweened.set($positionBalance.shortSharesPercentage);
	}

	$: breakPoint = (-100 + $longSharesPercentageTweened * 2) / 100;
	$: shortMultiplier = (1 + breakPoint) / (1 - breakPoint);
	$: longMultiplier = (1 - breakPoint) / (1 + breakPoint);
	$: previewBreakPoint = (-100 + $previewLongPercentage * 2) / 100;

	$: longData = Array.from({ length: 101 }, (_, i) => -1 + i * 0.02).map((x) => ({
		x: parseFloat(x.toFixed(3)),
		y: parseFloat(((1 - x) / (1 + x)).toFixed(3)),
		style:
			x < breakPoint
				? x < previewBreakPoint
					? 'regular'
					: 'previewInactive'
				: x < previewBreakPoint
				? 'preview'
				: 'gray'
	}));

	$: shortData = Array.from({ length: 101 }, (_, i) => -1 + i * 0.02).map((x) => ({
		x: parseFloat(x.toFixed(3)),
		y: parseFloat(((1 + x) / (1 - x)).toFixed(3)),
		style:
			x > breakPoint
				? x > previewBreakPoint
					? 'regular'
					: 'previewInactive'
				: x > previewBreakPoint
				? 'preview'
				: 'gray'
	}));

	/**
	 * @type {Chart}
	 */
	let chart;
	/**
	 * @type {HTMLCanvasElement}
	 */
	let chartCanvas;
	$: chartCanvas && longData && shortData && createChart(chartCanvas);

	/**
	 * @param {HTMLCanvasElement} canvas
	 */
	const createChart = (canvas) => {
		if (chart) {
			chart.data.datasets[0].data = longData;
			chart.data.datasets[1].data = shortData;
			chart.update();
		} else {
			chart = new Chart(canvas, {
				type: 'line',

				data: {
					labels: longData.map((row) => row.x),
					datasets: [
						{
							label: 'Long',
							data: longData,
							pointStyle: false,
							backgroundColor: 'rgb(21 127 31)',
							segment: {
								borderColor: (ctx) => {
									// @ts-ignore
									switch (ctx.p0.raw.style) {
										case 'regular':
											return 'rgb(21 127 31)';
										case 'preview':
											return '#86ef8f';
										case 'previewInactive':
											return '#22c530';
										default:
											return 'rgba(21,127,31,0.4)';
									}
								},
								borderCapStyle: 'round',
								borderWidth: (ctx) => {
									// @ts-ignore
									switch (ctx.p0.raw.style) {
										case 'regular':
											return 2;
										case 'preview':
											return 4;
										case 'previewInactive':
											return 2;
										default:
											return 2;
									}
								}
							},
							spanGaps: true
						},
						{
							label: 'Short',
							data: shortData,
							pointStyle: false,
							backgroundColor: 'rgb(189 24 39)',
							segment: {
								borderColor: (ctx) => {
									// @ts-ignore
									switch (ctx.p0.raw.style) {
										case 'regular':
											return 'rgb(189 24 39)';
										case 'preview':
											return '#fea3ab';
										case 'previewInactive':
											return '#f43f4f';
										default:
											return 'rgba(189,24,39,0.4)';
									}
								},
								borderCapStyle: 'round',
								borderWidth: (ctx) => {
									// @ts-ignore
									switch (ctx.p0.raw.style) {
										case 'regular':
											return 2;
										case 'preview':
											return 4;
										case 'previewInactive':
											return 2;
										default:
											return 2;
									}
								}
							},
							spanGaps: true
						}
					]
				},
				options: {
					plugins: {
						legend: {
							display: false
						}
					},
					scales: {
						y: {
							// beginAtZero: true,
							// @ts-ignore
							type: 'logarithmic',
							grid: {
								color: '#130E26'
							}
						},
						x: {
							ticks: {
								callback: (value) => {
									return value + '%';
								}
							},
							grid: {
								color: '#130E26'
							}
						}
					},
					interaction: {
						intersect: false,
						mode: 'index'
					}
				},
				plugins: [
					{
						id: 'hover-line',
						afterDraw: (chart) => {
							// @ts-ignore
							if (chart.tooltip?._active?.length) {
								// thin vertical line
								// @ts-ignore
								let x = chart.tooltip._active[0].element.x;
								let yAxis = chart.scales.y;
								let ctx = chart.ctx;
								ctx.save();
								ctx.beginPath();
								ctx.moveTo(x, yAxis.top);
								ctx.lineTo(x, yAxis.bottom);
								ctx.lineWidth = 1;
								ctx.strokeStyle = 'rgba(197,249,244,0.3)';
								ctx.stroke();

								// Fat line between long and short
								ctx.beginPath();
								// @ts-ignore
								ctx.moveTo(x, chart.tooltip._active[0].element.y);
								// @ts-ignore
								ctx.lineTo(x, chart.tooltip._active[1].element.y);
								ctx.lineWidth = 4;
								ctx.strokeStyle = 'rgba(197,249,244,0.3)';
								ctx.stroke();
								ctx.restore();
							}
						}
					}
				]
			});
		}
	};

	onDestroy(() => {
		if (!chart) return;
		chart.destroy();
	});
</script>

<div class="box">
	<div class="box-head">Share Distribution</div>

	<div class="box-content">
		{#if $positionBalance.loading}
			<p>Loading position balance.</p>
		{:else if $positionBalance.error}
			<p>Error: {$positionBalance.error.message}</p>
		{:else}
			<canvas bind:this={chartCanvas} id="positionBalanceChart" />

			<div class="pl-[57px] pr-[15px]">
				<div class="relative dark:bg-slate-600 rounded h-8">
					<div
						class="absolute font-semibold left-0 h-full bg-green-700 dark:text-slate-100 text-xs text-left leading-8 px-3"
						style={`width: ${$longSharesPercentageTweened}%`}
					>
						{$longSharesPercentageTweened.toFixed(2)}%
					</div>

					{#if $previewLongPercentage > $longSharesPercentageTweened}
						<div
							class="absolute font-semibold left-0 h-full bg-green-400 dark:text-slate-100 text-xs text-right leading-8 px-3 z-10"
							style={`width: ${
								$previewLongPercentage - $longSharesPercentageTweened
							}%; left: ${$longSharesPercentageTweened}%`}
						>
							<span class="absolute right-3 w-32">
								&rarr; {($previewLongPercentage - $longSharesPercentageTweened).toFixed(2)}%
							</span>
						</div>
					{:else if $previewLongPercentage < $longSharesPercentageTweened}
						<div
							class="absolute font-semibold left-0 h-full bg-red-500 dark:text-slate-100 text-xs text-left leading-8 px-3 z-10"
							style={`width: ${
								$longSharesPercentageTweened - $previewLongPercentage
							}%; left: ${$previewLongPercentage}%`}
						>
							<span class="absolute left-3 w-32">
								{($longSharesPercentageTweened - $previewLongPercentage).toFixed(2)}% &larr;
							</span>
						</div>
					{/if}

					<div
						class="absolute font-semibold right-0 h-full bg-red-700 dark:text-slate-100 text-xs text-right leading-8 px-3"
						style={`width: ${$shortSharesPercentageTweened}%`}
					>
						<span class="absolute right-3">
							{$shortSharesPercentageTweened.toFixed(2)}%
						</span>
					</div>
				</div>

				<div class="flex flex-row mt-3">
					<div class="">
						Long
						<br />
						HYP {formatValue($longSharesTweened, liquidityPoolDecimals, 2, { showSymbol: false })}
						{#if $previewShares && $previewPosition.isLong}
							&rarr; {formatValue($previewShares, liquidityPoolDecimals, 2, { showSymbol: false })}
						{/if}
						<br />
						Multiplier: {longMultiplier.toFixed(2)}
						{#if $previewLongMultiplier !== longMultiplier}
							&rarr; {$previewLongMultiplier.toFixed(2)}
						{/if}
					</div>
					<div class="grow text-right">
						Short
						<br />
						HYP {formatValue($shortSharesTweened, liquidityPoolDecimals, 2, { showSymbol: false })}
						{#if $previewShares && !$previewPosition.isLong}
							&rarr; {formatValue($previewShares, liquidityPoolDecimals, 2, { showSymbol: false })}
						{/if}
						<br />
						Multiplier: {shortMultiplier.toFixed(2)}
						{#if $previewShortMultiplier !== shortMultiplier}
							&rarr; {$previewShortMultiplier.toFixed(2)}
						{/if}
					</div>
				</div>
			</div>

			<div />
		{/if}
	</div>
</div>
