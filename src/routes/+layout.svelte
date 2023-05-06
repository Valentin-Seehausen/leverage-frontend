<script>
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Nav from './Nav.svelte';
	import '../app.css';
	import { Client, setContextClient, cacheExchange, fetchExchange } from '@urql/svelte';

	// Toast Options
	/** @type {import("@zerodevx/svelte-toast/stores").SvelteToastOptions} */
	const options = {
		classes: ['log']
	};

	const client = new Client({
		url: 'https://api.studio.thegraph.com/query/46177/p2p-leverage-operations/v0.0.4',
		exchanges: [cacheExchange, fetchExchange]
	});

	setContextClient(client);
</script>

<Nav />

<div class="max-w-screen-2xl m-auto xl:p-3">
	<slot />
</div>

<div class="toast-wrap">
	<SvelteToast {options} />
</div>

<style>
	:global(._toastContainer) {
		--toastContainerTop: auto;
		--toastContainerBottom: 2rem;
	}
	:global(.log.info) {
		--toastBackground: theme(colors.amber.700);
		--toastBarBackground: theme(colors.amber.600);
	}
	:global(.log.error) {
		--toastBackground: theme(colors.red.800);
		--toastBarBackground: theme(colors.red.700);
	}
	:global(.log.success) {
		--toastBackground: theme(colors.green.600);
		--toastBarBackground: theme(colors.green.500);
	}
</style>
