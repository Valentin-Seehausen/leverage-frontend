<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { fly } from 'svelte/transition';

	import { openUserPositions } from '$lib/stores/positions/openUserPositions';
	import PositionTable from './PositionTable.svelte';
	import { closedUserPositions } from '$lib/stores/positions/closedUserPositions';

	dayjs.extend(relativeTime);

	let activeTab = 'open';
	$: $openUserPositions;
</script>

<div class="box p-0 overflow-hidden">
	<div class="box-head dark:bg-valhalla-300/10 w-full m-0 p-6 py-4">
		<span class="font-semibold font-heading mb-3 mr-3 info-label">Positions:</span>
		<button
			on:click={() => (activeTab = 'open')}
			class={`hover:dark:text-slate-100 font-semibold font-heading mr-3 ${
				activeTab == 'open' ? 'underline' : 'dark:text-slate-400'
			}`}>Open</button
		>
		<button
			on:click={() => (activeTab = 'closed')}
			class={`hover:dark:text-slate-100  font-semibold font-heading mr-3 ${
				activeTab == 'closed' ? 'underline' : 'dark:text-slate-400'
			}`}>Closed</button
		>
	</div>
	<div class="overflow-hidden h-[570px] relative">
		{#if activeTab === 'open'}
			<div
				class="top-0 absolute h-[500px] w-full"
				in:fly|local={{ x: '-100%', duration: 250 }}
				out:fly|local={{ x: '-100%', duration: 250 }}
			>
				{#if $openUserPositions.loading}
					<p>Loading your positions.</p>
				{:else if $openUserPositions.error}
					<p>Error: {$openUserPositions.error.message}</p>
				{:else}
					<PositionTable positions={$openUserPositions.positions} show={'open'} />
				{/if}
			</div>
		{:else if activeTab === 'closed'}
			<div
				class="top-0 absolute h-[500px] w-full"
				in:fly|local={{ x: '100%', duration: 250 }}
				out:fly|local={{ x: '100%', duration: 250 }}
			>
				{#if $closedUserPositions.loading}
					<p>Loading your positions.</p>
				{:else if $closedUserPositions.error}
					<p>Error: {$closedUserPositions.error.message}</p>
				{:else}
					<PositionTable positions={$closedUserPositions.positions} show={'closed'} />
				{/if}
			</div>
		{/if}
	</div>
</div>
