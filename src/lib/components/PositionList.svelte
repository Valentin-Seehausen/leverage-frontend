<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import PositionCard from './PositionCard.svelte';
	import PositionRow from './PositionRow.svelte';
	import { openUserPositions } from '$lib/stores/positions';
	dayjs.extend(relativeTime);
</script>

<div class="box">
	<h2 class="font-semibold font-heading mb-2">Your Positions</h2>
	{#if $openUserPositions.fetching}
		<p>Loading your positions.</p>
	{:else if $openUserPositions.error}
		<p>Error: {$openUserPositions.error.message}</p>
	{:else}
		<div class="lg:hidden">
			<div class="grid grid-cols-1 gap-4">
				{#each $openUserPositions.data.positions as position}
					<PositionCard {position} />
				{/each}
			</div>
		</div>
		<div class="hidden lg:block">
			<div>
				<table class="min-w-full table-auto">
					<thead>
						<tr>
							<th class=" pl-2 py-2 text-left">Type</th>
							<th class=" px-0 py-2 text-right">Leverage</th>
							<th class=" px-2 py-2 text-right">Collateral</th>
							<th class=" px-2 py-2 text-right">Entry Price</th>
							<th class=" px-2 py-2 text-right">Liquidation Price</th>
							<th class=" px-2 py-2 text-right">Take Profit Price</th>
						</tr>
					</thead>
					<tbody>
						{#each $openUserPositions.data.positions as position, i}
							<PositionRow {position} index={i} />
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
