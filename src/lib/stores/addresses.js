import arbitrumSepoliaAddresses from '$lib/addresses/contracts.arbitrum-sepolia.json';
import arbitrumGoerliDevAddresses from '$lib/addresses/dev.contracts.arbitrum-goerli.json';
import {
	dev,
	graphEndpointArbitrumSepolia,
	graphEndpointArbitrumGoerliDev
} from '$lib/config/constants';

import { writable } from 'svelte/store';
import { isInitialized } from './client';
import { getAddress } from 'viem';

/**
 * @param {Object} rawAddresses - The raw addresses object
 * @param {any} rawAddresses.liquidityPool - The liquidity pool address
 * @param {any} rawAddresses.faucet - The faucet address
 * @param {string} [rawAddresses.network] - The network name
 * @param {any} rawAddresses.priceFeed - The price feed address
 * @param {string} rawAddresses.priceFeedAggregator - The price feed aggregator address
 * @param {string} [rawAddresses.proxyAdmin] - The proxy admin address
 * @param {number} [rawAddresses.startBlock] - The starting block number
 * @param {any} rawAddresses.tradePair - The trade pair address
 * @param {any} rawAddresses.usdc - The usdc address
 */
const parseAddresses = (rawAddresses) => {
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
		addresses: parseAddresses(arbitrumSepoliaAddresses),
		graphEndpoint: graphEndpointArbitrumSepolia
	};
	let state = initState;

	const { subscribe, set } = writable(state);

	const setState = () => {
		if (dev) {
			state.addresses = parseAddresses(arbitrumGoerliDevAddresses);
			state.graphEndpoint = graphEndpointArbitrumGoerliDev;
		} else {
			state.addresses = parseAddresses(arbitrumSepoliaAddresses);
			state.graphEndpoint = graphEndpointArbitrumSepolia;
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
