import arbitrumGoerliAddresses from '$lib/addresses/contracts.arbitrum-goerli.json';
import arbitrumGoerliDevAddresses from '$lib/addresses/dev.contracts.arbitrum-goerli.json';
import {
	dev,
	graphEndpointArbitrumGoerli,
	graphEndpointArbitrumGoerliDev
} from '$lib/config/constants';

import { writable } from 'svelte/store';
import { isInitialized } from './client';

const createAddressStore = () => {
	const initState = {
		addresses: arbitrumGoerliAddresses,
		graphEndpoint: graphEndpointArbitrumGoerli
	};
	let state = initState;

	const { subscribe, set } = writable(state);

	// Set first state
	const setState = () => {
		if (dev) {
			state.addresses = arbitrumGoerliDevAddresses;
			state.graphEndpoint = graphEndpointArbitrumGoerliDev;
		} else {
			state.addresses = arbitrumGoerliAddresses;
			state.graphEndpoint = graphEndpointArbitrumGoerli;
		}

		set(state);
	};
	setState();

	isInitialized.subscribe(($isInitialized) => {
		if (!$isInitialized) return;
		setState();
	});

	return {
		subscribe
	};
};

export const addresses = createAddressStore();
