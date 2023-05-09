import { graphEndpoint } from '$lib/config/constants';
import { Client, cacheExchange, fetchExchange } from '@urql/svelte';

export const graphClient = new Client({
	url: graphEndpoint,
	exchanges: [cacheExchange, fetchExchange]
});
