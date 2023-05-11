import { Client, cacheExchange, fetchExchange } from '@urql/svelte';
import { addresses } from '$lib/stores/addresses';
import { derived, get } from 'svelte/store';

const initialClient = new Client({
	url: get(addresses).graphEndpoint,
	exchanges: [cacheExchange, fetchExchange]
});

export const graphClientStore = derived(
	addresses,
	($addresses, set) => {
		const client = new Client({
			url: $addresses.graphEndpoint,
			exchanges: [cacheExchange, fetchExchange]
		});

		set(client);
	},
	initialClient
);
