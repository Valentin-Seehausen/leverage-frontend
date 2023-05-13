<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
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
		<div class="overflow-hidden h-[570px] relative">
			{#if activeTab === 'open'}
				{#if $openUserPositions.loading}
					<p>Loading your positions.</p>
				{:else if $openUserPositions.error}
					<p>Error: {$openUserPositions.error.message}</p>
				{:else}
					<div
						class="top-0 absolute h-[500px] w-full"
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
						class="top-0 absolute h-[500px] w-full"
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
