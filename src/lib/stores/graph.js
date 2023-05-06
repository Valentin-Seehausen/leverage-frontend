import { Client, cacheExchange, fetchExchange } from '@urql/svelte';

export const graphClient = new Client({
	url: 'https://api.studio.thegraph.com/query/46177/p2p-leverage-operations/v0.0.7',
	exchanges: [cacheExchange, fetchExchange]
});
