<script>
	/**
	 * @type {string}
	 */
	export let text;
	export let showCheckbox = false;
</script>

{#if showCheckbox}
	<div
		class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-700"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6 inline"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
		</svg>
	</div>
{:else}
	<div
		class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-700"
	>
		{text}
	</div>
{/if}
