<script>
	import { liquidityPoolDecimals } from '$lib/config/constants';
	import { positionBalance } from '$lib/stores/positionBalance';
	import { formatValue } from '$lib/utils/format';
	import { interpolateBigInts as interpolate } from '$lib/utils/interpolateBigInts';
	import { sineInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import Chart from 'chart.js/auto';

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

	$: breakPoint = (-100 + $longSharesPercentageTweened * 2) / 100;
	$: shortMultiplier = (1 + breakPoint) / (1 - breakPoint);
	$: longMultiplier = (1 - breakPoint) / (1 + breakPoint);

	/**
	 * @type {HTMLCanvasElement}
	 */
	let chartCanvas;

	$: longData = Array.from({ length: 101 }, (_, i) => -1 + i * 0.02).map((x) => ({
		x: parseFloat(x.toFixed(3)),
		y: parseFloat(((1 - x) / (1 + x)).toFixed(3)),
		active: breakPoint > 0.5 ? x > breakPoint : x < breakPoint
	}));

	$: shortData = Array.from({ length: 101 }, (_, i) => -1 + i * 0.02).map((x) => ({
		x: parseFloat(x.toFixed(3)),
		y: parseFloat(((1 + x) / (1 - x)).toFixed(3)),
		active: breakPoint > 0.5 ? x > breakPoint : x < breakPoint
	}));

	/**
	 * @type {Chart<"line", { x: number; y: number; active: boolean; }[], number>}
	 */
	let chart;
	$: chartCanvas && longData && shortData && createChart();

	const createChart = () => {
		if (chart) chart.destroy();
		// @ts-ignore
		chart = new Chart(chartCanvas.getContext('2d'), {
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
								console.log(ctx);
								// @ts-ignore
								if (ctx.p0.raw.active) return 'rgb(21 127 31)';
								else return 'rgba(21,127,31,0.4)';
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
								if (ctx.p0.raw.active) return 'rgb(189 24 39)';
								else return 'rgba(189,24,39,0.4)';
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
						beginAtZero: true,
						type: 'logarithmic',
						grid: {
							color: '#130E26'
						}
					},
					x: {
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
				{ legend: { display: false } },
				{
					afterDraw: (chart) => {
						// @ts-ignore
						let x = 0.6;
						let yAxis = chart.scales.y;
						let ctx = chart.ctx;
						ctx.save();
						ctx.beginPath();
						ctx.moveTo(x, yAxis.top);
						ctx.lineTo(x, yAxis.bottom);
						ctx.lineWidth = 1;
						ctx.strokeStyle = '#6B6288';
						ctx.stroke();
						ctx.restore();

						// @ts-ignore
						if (chart.tooltip?._active?.length) {
							// @ts-ignore
							let x = chart.tooltip._active[0].element.x;
							let yAxis = chart.scales.y;
							let ctx = chart.ctx;
							ctx.save();
							ctx.beginPath();
							ctx.moveTo(x, yAxis.top);
							ctx.lineTo(x, yAxis.bottom);
							ctx.lineWidth = 1;
							ctx.strokeStyle = '#6B6288';
							ctx.stroke();
							ctx.restore();
						}
					}
				}
			]
		});
	};
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
						<br />
						Multiplier: {longMultiplier.toFixed(2)}x
					</div>
					<div class="grow text-right">
						Short
						<br />
						HYP {formatValue($shortSharesTweened, liquidityPoolDecimals, 2, { showSymbol: false })}
						<br />
						Multiplier: {shortMultiplier.toFixed(2)}x
					</div>
				</div>
			</div>

			<div />
		{/if}
	</div>
</div>
