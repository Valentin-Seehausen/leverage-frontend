<script>
	import { closeablePositions } from '$lib/stores/positions/closeablePositions';
	import { closeCloseablePositions } from '$lib/stores/tradePair';
	import { slide } from 'svelte/transition';

	$: possible = $closeablePositions.length > 0;
</script>

{#if possible}
	<div class="lg:flex">
		<div
			transition:slide|local
			class="box mt-6 md:my-0 lg:w-full lg:flex place-content-between items-center"
		>
			<div class="box-content">
				<div class="info-label mb-4 lg:mb-0">
					Lucky you! You can send a house keeping transaction to close other traders position and
					earn $0.5.
				</div>
				<div>
					<button on:click={closeCloseablePositions} class="user-button">House Keeping 🧹</button>
				</div>
			</div>
		</div>
	</div>
{/if}
