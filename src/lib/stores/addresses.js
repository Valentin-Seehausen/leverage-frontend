import arbitrumGoerliAddresses from '$lib/addresses/contracts.arbitrum-goerli.json';
import arbitrumGoerliDevAddresses from '$lib/addresses/dev.contracts.arbitrum-goerli.json';
import {
	dev,
	graphEndpointArbitrumGoerli,
	graphEndpointArbitrumGoerliDev
} from '$lib/config/constants';

import { writable } from 'svelte/store';
import { isInitialized } from './client';
import { getAddress } from 'viem';

const parseAddresses = (
	/** @type {{ liquidityPool: any; faucet: any; network?: string; priceFeed: any; priceFeedAggregator: string; proxyAdmin?: string; startBlock?: number; tradePair: any; usdc: any; }} */ rawAddresses
) => {
	return {
		liquidityPool: getAddress(rawAddresses.liquidityPool),
		usdc: getAddress(rawAddresses.usdc),
		faucet: getAddress(rawAddresses.faucet),
		tradePair: getAddress(rawAddresses.tradePair),
		priceFeed: getAddress(rawAddresses.priceFeed),
		priceFeedAggregator: getAddress(rawAddresses.priceFeedAggregator)
	};
};

const createAddressStore = () => {
	const initState = {
		addresses: parseAddresses(arbitrumGoerliAddresses),
		graphEndpoint: graphEndpointArbitrumGoerli
	};
	let state = initState;

	const { subscribe, set } = writable(state);

	// Set first state
	const setState = () => {
		if (dev) {
			state.addresses = parseAddresses(arbitrumGoerliDevAddresses);
			state.graphEndpoint = graphEndpointArbitrumGoerliDev;
		} else {
			state.addresses = parseAddresses(arbitrumGoerliAddresses);
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
