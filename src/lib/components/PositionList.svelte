<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import PositionCard from './PositionCard.svelte';
	import PositionRow from './PositionRow.svelte';
	import { openUserPositions, closedUserPositions } from '$lib/stores/positions';
	dayjs.extend(relativeTime);

	let activeTab = 'open';
	$: positions = activeTab === 'open' ? $openUserPositions : $closedUserPositions;
</script>

<div class="box">
	<span class="font-semibold font-heading mb-3 mr-3 info-label">Positions:</span>
	<button
		on:click={() => (activeTab = 'open')}
		class={`hover:dark:text-slate-100 font-semibold font-heading  mb-3 mr-3 ${
			activeTab == 'open' ? 'underline' : 'dark:text-slate-400'
		}`}>Open</button
	>
	<button
		on:click={() => (activeTab = 'closed')}
		class={`hover:dark:text-slate-100  font-semibold font-heading  mb-3 mr-3 ${
			activeTab == 'closed' ? 'underline' : 'dark:text-slate-400'
		}`}>Closed</button
	>
	{#if positions.fetching}
		<p>Loading your positions.</p>
	{:else if positions.error}
		<p>Error: {positions.error.message}</p>
	{:else}
		<div class="lg:hidden">
			<div class="grid grid-cols-1 gap-4">
				{#each positions.data.positions as position}
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
							{#if activeTab === 'open'}
								<th class=" px-2 py-2 text-right">Liquidation Price</th>
								<th class=" px-2 py-2 text-right">Take Profit Price</th>
							{:else if activeTab === 'closed'}
								<th class=" px-2 py-2 text-right">Close Price</th>
								<th class=" px-2 py-2 text-right">PnL</th>
							{/if}
						</tr>
					</thead>
					<tbody>
						{#each positions.data.positions as position, i}
							<PositionRow {position} index={i} />
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
