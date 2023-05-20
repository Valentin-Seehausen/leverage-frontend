<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let deg = 0;

	onMount(() => {
		const intervalId = setInterval(() => {
			deg = (deg + 1) % 360;
		}, 50 / 6); //

		return () => {
			clearInterval(intervalId);
		};
	});
</script>

<div class="relative group flex-initial">
	<div
		transition:fade|local
		style="background: linear-gradient({deg}deg, var(--tw-gradient-stops));"
		class="absolute -inset-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg blur-xl opacity-50 group-hover:opacity-80 transition-all"
	/>

	<div class="relative">
		<slot />
	</div>
</div>
