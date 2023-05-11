import { derived, get } from 'svelte/store';
import { addresses } from './addresses';
import { getProvider, getContract } from '@wagmi/core';
import priceFeedABI from '$lib/abis/AggregatorProxy';
import aggregatorAbi from '$lib/abis/OffChainAggregator';
import liquidityPoolAbi from '$lib/abis/LiquidityPool';
import tradePairAbi from '$lib/abis/TradePair';
import usdcAbi from '$lib/abis/USDC';

const createState = (
	/** @type {{ liquidityPool: any; network?: string; priceFeed: any; proxyAdmin?: string; startBlock?: number; tradePair: any; usdc: any; }} */ addresses
) => {
	/**
	 *
	 * @param {import('@wagmi/core').Provider | import('@wagmi/core').Signer} signerOrProvider
	 * @returns
	 */
	const getLiquidityPoolContract = (signerOrProvider = getProvider()) =>
		getContract({
			address: addresses.liquidityPool,
			abi: liquidityPoolAbi,
			signerOrProvider
		});

	/**
	 *
	 * @param {import('@wagmi/core').Provider | import('@wagmi/core').Signer} signerOrProvider
	 * @returns
	 */
	const getTradePairContract = (signerOrProvider = getProvider()) =>
		getContract({
			address: addresses.tradePair,
			abi: tradePairAbi,
			signerOrProvider
		});

	/**
	 *
	 * @param {import('@wagmi/core').Provider | import('@wagmi/core').Signer} signerOrProvider
	 * @returns
	 */
	const getUsdcContract = (signerOrProvider = getProvider()) =>
		getContract({
			address: addresses.usdc,
			abi: usdcAbi,
			signerOrProvider
		});

	/**
	 *
	 * @param {import('@wagmi/core').Provider | import('@wagmi/core').Signer} signerOrProvider
	 * @returns
	 */
	const getPriceFeedContract = (signerOrProvider = getProvider()) =>
		getContract({
			address: addresses.priceFeed,
			abi: priceFeedABI,
			signerOrProvider
		});

	return {
		getTradePairContract,
		getLiquidityPoolContract,
		getUsdcContract,
		getPriceFeedContract
	};
};

export const contracts = derived(
	addresses,
	($addresses, set) => {
		set(createState($addresses.addresses));
	},
	createState(get(addresses).addresses)
);

export const tradePairContract = derived(contracts, ($contracts) => {
	return $contracts.getTradePairContract();
});

export const usdcContract = derived(contracts, ($contracts) => {
	return $contracts.getUsdcContract();
});

export const priceFeedContract = derived(contracts, ($contracts) => {
	return $contracts.getPriceFeedContract();
});

export const priceFeedAggregatorContract = derived(priceFeedContract, ($priceFeed, set) => {
	$priceFeed.aggregator().then((aggregatorAddress) => {
		const aggregator = getContract({
			address: aggregatorAddress,
			abi: aggregatorAbi,
			signerOrProvider: getProvider()
		});
		set(aggregator);
		return aggregator;
	});
});
