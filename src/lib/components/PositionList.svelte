<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import Position from './Position.svelte';
	import { openUserPositions } from '$lib/stores/positions';
	dayjs.extend(relativeTime);
</script>

<div class="box">
	<h2 class="font-semibold font-heading mb-2">Your Positions</h2>
	<div class="grid grid-cols-1 gap-4">
		{#if $openUserPositions.fetching}
			<p>Fetching...</p>
		{:else if $openUserPositions.error}
			<p>Error: {$openUserPositions.error.message}</p>
		{:else}
			{#each $openUserPositions.data.positions as position}
				<Position {position} />
			{/each}
		{/if}
	</div>
</div>
