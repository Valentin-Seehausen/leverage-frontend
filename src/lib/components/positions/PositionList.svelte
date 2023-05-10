<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import PositionCard from './PositionCard.svelte';

	import { openUserPositions } from '$lib/stores/openUserPositions';
	import PositionTable from './PositionTable.svelte';
	// import { closedUserPositions } from '$lib/stores/closedUserPositions';

	dayjs.extend(relativeTime);

	let activeTab = 'open';
	// $: positions = activeTab === 'open' ? $openUserPositions : $closedUserPositions;
	$: positions = $openUserPositions;
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
	{#if positions.loading}
		<p>Loading your positions.</p>
	{:else if positions.error}
		<p>Error: {positions.error.message}</p>
	{:else}
		<div class="lg:hidden">
			<div class="grid grid-cols-1 gap-4">
				{#each positions.positions as position}
					<PositionCard {position} />
				{/each}
			</div>
		</div>
		<div class="hidden lg:block">
			<PositionTable positions={positions.positions} show={activeTab} />
		</div>
	{/if}
</div>
