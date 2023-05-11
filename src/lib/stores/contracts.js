import { derived, get } from 'svelte/store';
import { addresses } from './addresses';
import { getProvider, getContract } from '@wagmi/core';
import liquidityPoolAbi from '$lib/abis/LiquidityPool';
import tradePairAbi from '$lib/abis/TradePair';
import usdcAbi from '$lib/abis/USDC';

const createState = (
	/** @type {{ liquidityPool: any; network?: string; priceFeed?: string; proxyAdmin?: string; startBlock?: number; tradePair: any; usdc: any; }} */ addresses
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

	return {
		getTradePairContract,
		getLiquidityPoolContract,
		getUsdcContract
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
