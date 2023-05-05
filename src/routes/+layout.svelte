<script>
	import Nav from './Nav.svelte';
	import '../app.css';

	import { Client, setContextClient, cacheExchange, fetchExchange } from '@urql/svelte';

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
