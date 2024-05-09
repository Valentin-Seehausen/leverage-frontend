<script>
	import { transactionLog } from '$lib/stores/transactionLog';
	import { slide } from 'svelte/transition';
	import { clickOutside } from '$lib/utils/clickOutside';
	import { flip } from 'svelte/animate';

	let open = false;
	$: $transactionLog.length == 0 && (open = false);
</script>

{#if $transactionLog.length > 0}
	<div
		class="relative flex flex-col justify-end items-end flex-nowrap cursor-pointer"
		on:click={() => {
			open = !open;
		}}
		on:keydown={() => {
			open = !open;
		}}
		use:clickOutside
		on:outclick={() => {
			open = false;
		}}
	>
		<div class="flex justify-center items-center box dark:bg-valhalla-800 z-10 px-3 py-1 m-0">
			<svg
				class="animate-spin h-5 w-5 text-primary mr-3"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			Pending {$transactionLog.length}
		</div>
		{#if open}
			<div
				class="absolute w-56 right-0 top-12 box m-0 mt-1 p-3 dark:bg-valhalla-800"
				transition:slide|local
			>
				{#each $transactionLog as tx (tx)}
					<div
						class="border-b p-1 dark:border-valhalla-200/30 last:border-none"
						animate:flip={{ duration: 200 }}
					>
						{tx.message}
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}
