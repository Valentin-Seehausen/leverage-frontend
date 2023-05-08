import { getProvider, getContract } from '@wagmi/core';
import liquidityPoolAbi from '$lib/abis/LiquidityPool';
import tradePairAbi from '$lib/abis/TradePair';
import {
	liquidityPool as liquidityPoolAddress,
	tradePair as tradePairAddress
} from '$lib/addresses/contracts.sepolia.json';

/**
 *
 * @param {import('@wagmi/core').Provider | import('@wagmi/core').Signer} signerOrProvider
 * @returns
 */
export const getLiquidityPoolContract = (signerOrProvider = getProvider()) =>
	getContract({
		address: liquidityPoolAddress,
		abi: liquidityPoolAbi,
		signerOrProvider
	});

/**
 *
 * @param {import('@wagmi/core').Provider | import('@wagmi/core').Signer} signerOrProvider
 * @returns
 */
export const getTradePairContract = (signerOrProvider = getProvider()) =>
	getContract({
		address: tradePairAddress,
		abi: tradePairAbi,
		signerOrProvider
	});
