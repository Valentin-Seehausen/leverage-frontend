<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import PositionCard from './PositionCard.svelte';
	import { fly } from 'svelte/transition';

	import { openUserPositions } from '$lib/stores/positions/openUserPositions';
	import PositionTable from './PositionTable.svelte';
	import { closedUserPositions } from '$lib/stores/positions/closedUserPositions';

	dayjs.extend(relativeTime);

	let activeTab = 'open';
	$: positions = activeTab === 'open' ? $openUserPositions : $closedUserPositions;
	$: $openUserPositions;
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
		<div class="overflow-x-hidden overflow-y-scroll h-80 w-full relative">
			{#if activeTab === 'open'}
				{#if $openUserPositions.loading}
					<p>Loading your positions.</p>
				{:else if $openUserPositions.error}
					<p>Error: {$openUserPositions.error.message}</p>
				{:else}
					<div
						class="hidden lg:block absolute top-0 w-full"
						in:fly={{ x: '-100%', duration: 250 }}
						out:fly={{ x: '-100%', duration: 250 }}
					>
						<PositionTable positions={$openUserPositions.positions} show={'open'} />
					</div>
				{/if}
			{:else if activeTab === 'closed'}
				{#if $closedUserPositions.loading}
					<p>Loading your positions.</p>
				{:else if $closedUserPositions.error}
					<p>Error: {$closedUserPositions.error.message}</p>
				{:else}
					<div
						class="hidden lg:block absolute top-0 w-full"
						in:fly={{ x: '100%', duration: 250 }}
						out:fly={{ x: '100%', duration: 250 }}
					>
						<PositionTable positions={$closedUserPositions.positions} show={'closed'} />
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
