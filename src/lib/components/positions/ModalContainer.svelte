<script>
	import Transition from 'svelte-transition';
	import { positionDetailsModal, positionDetailsDialog } from '$lib/stores/positionDetailsModal.js';
	import PositionModal from './PositionModal.svelte';
	import { browser } from '$app/environment';

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
			<div class="flex min-h-full items-center justify-center p-4 text-center">
				<Transition
					enter="transition-all"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="transition-all"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<div
						class="box w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all"
						use:positionDetailsDialog.modal
					>
						{#if $positionDetailsModal}
							<PositionModal position={$positionDetailsModal} />
						{/if}
						<div class="mt-4">
							<button
								type="button"
								class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
								on:click={positionDetailsDialog.close}
							>
								Got it, thanks!
							</button>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</Transition>
</div>
