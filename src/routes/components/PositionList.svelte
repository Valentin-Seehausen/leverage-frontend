<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	let positions = [
		{
			id: 1,
			isLong: true,
			collateral: 100,
			leverage: 10,
			entryPrice: 20000,
			liquidationPrice: 18000,
			takeProfitPrice: 22000,
			openDate: 1682516394
		},
		{
			id: 2,
			isLong: false,
			collateral: 100,
			leverage: 10,
			entryPrice: 22000,
			liquidationPrice: 24200,
			takeProfitPrice: 19800,
			openDate: 1682516794
		},
		{
			id: 3,
			isLong: false,
			collateral: 100,
			leverage: 10,
			entryPrice: 20000,
			liquidationPrice: 22000,
			takeProfitPrice: 18000,
			openDate: 1682516094,
			closeDate: 1682516794,
			pnl: 100
		},
		{
			id: 4,
			isLong: true,
			collateral: 100,
			leverage: 10,
			entryPrice: 20000,
			liquidationPrice: 18000,
			takeProfitPrice: 22000,
			openDate: 1682516094,
			closeDate: 1682516794,
			pnl: -100
		}
	];
</script>

<div class="p-6">
	<h2 class="font-semibold mb-2">Positions</h2>
	{#each positions as position}
		<div class="mb-8">
			<!-- Open Position -->
			{#if !position.closeDate}
				<div class="flex flex-row">
					<div class="basis-1/4">{position.leverage}x</div>
					<div class="basis-1/4">
						${position.collateral}
					</div>
					<div class="grow text-right">
						{position.entryPrice}
					</div>
				</div>

				<div class="flex flex-row">
					<div class="basis-1/3">
						{#if position.isLong}
							<span class="text-green-500">Long</span>
						{:else}
							<span class="text-red-500">Short</span>
						{/if}
					</div>
					<div class="grow justify-end text-right text-slate-500">
						opened {dayjs.unix(position.openDate).fromNow()}
					</div>
				</div>
			{:else}
				<!-- Closed Position -->
				<div class="flex flex-row">
					<div class="basis-1/4">{position.leverage}x</div>
					<div class="basis-1/4">
						{#if position.pnl > 0}
							<span class="text-green-500">
								${position.pnl}
							</span>
							🤑
						{:else}
							<span class="text-red-500">
								${position.pnl}
							</span>
							❌
						{/if}
					</div>
					<div class="grow text-right">
						{position.entryPrice} -> {position.pnl > 0
							? position.takeProfitPrice
							: position.liquidationPrice}
					</div>
				</div>

				<div class="flex flex-row">
					<div class="basis-1/4">
						{#if position.isLong}
							<span class="text-green-500">Long</span>
						{:else}
							<span class="text-red-500">Short</span>
						{/if}
					</div>
					<div class="grow justify-end text-right text-slate-500">
						closed {dayjs.unix(position.closeDate).fromNow()}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
