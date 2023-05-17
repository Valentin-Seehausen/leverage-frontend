<script>
	import Transition from 'svelte-transition';
	import { positionDetailsModal, positionDetailsDialog } from '$lib/stores/positionDetailsModal.js';
	import PositionModal from './PositionModal.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let deg = 0;

	onMount(() => {
		const intervalId = setInterval(() => {
			deg = (deg + 1) % 360;
		}, 500 / 6); //

		return () => {
			clearInterval(intervalId);
		};
	});

	$: if (browser) document.body.classList.toggle('noscroll', $positionDetailsDialog.expanded);
</script>

<div class="relative z-10">
	<Transition show={$positionDetailsDialog.expanded}>
		<Transition
			enter="transition-all"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-all"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div
				class="fixed inset-0 bg-black bg-opacity-25"
				on:click={positionDetailsDialog.close}
				on:keydown={positionDetailsDialog.close}
			/>
		</Transition>
		<div class="fixed inset-0 overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4 md:p-4 text-center">
				<Transition
					enter="  transition-all"
					enterFrom=" opacity-0 scale-95"
					enterTo=" opacity-100 scale-100"
					leave=" transition-all"
					leaveFrom=" opacity-100 scale-100"
					leaveTo="enter opacity-0 scale-95"
				>
					<div class="relative group flex-initial">
						<div
							style="background: linear-gradient({deg}deg, var(--tw-gradient-stops));"
							class="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition-all"
						/>
						<div
							class="box from-valhalla-800/90 to-valhalla-700/90 md:from-valhalla-800/90 md:to-valhalla-900/90 relative dark:border-valhalla-400/60 w-full m-0 p-0 max-w-md transform overflow-hidden rounded-2xl text-left align-middle transition-all"
							use:positionDetailsDialog.modal
						>
							{#if $positionDetailsModal}
								<PositionModal position={$positionDetailsModal} />
							{/if}
							<div class="box-action">
								<button type="button" on:click={positionDetailsDialog.close}> Close </button>
							</div>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</Transition>
</div>
