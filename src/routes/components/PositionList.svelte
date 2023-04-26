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
			openDate: 1682516394
		},
		{
			id: 2,
			isLong: false,
			collateral: 100,
			leverage: 10,
			entryPrice: 20000,
			openDate: 1682516794
		}
	];
</script>

<div class="p-6">
	<h2 class="font-semibold mb-2">Positions</h2>
	{#each positions as position}
		<div class="mb-4">
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
				{#if position.isLong}
					<span class="text-green-500">Long</span>
				{:else}
					<span class="text-red-500">Short</span>
				{/if}
				<div class="basis-1/3" />
				<div class="grow justify-end text-right text-slate-500">
					{dayjs.unix(position.openDate).fromNow()}
				</div>
			</div>
		</div>
	{/each}
</div>
