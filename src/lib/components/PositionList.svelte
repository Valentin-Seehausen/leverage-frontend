<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import Position from './Position.svelte';

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
			openDate: 1682516394,
			closeDate: 0,
			pnl: 0
		},
		{
			id: 2,
			isLong: false,
			collateral: 100,
			leverage: 10,
			entryPrice: 22000,
			liquidationPrice: 24200,
			takeProfitPrice: 19800,
			openDate: 1682516794,
			closeDate: 0,
			pnl: 0
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
	<h2 class="font-semibold font-heading mb-2">Positions</h2>
	<div class="grid grid-cols-1 gap-4">
		{#each positions as position}
			<Position {position} />
		{/each}
	</div>
</div>
