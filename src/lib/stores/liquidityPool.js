import { getContract, getProvider } from '@wagmi/core';
import liquidityPoolAbi from '$lib/abis/LiquidityPool';
import {
	liquidityPool as liquidityPoolAddress,
	tradePair as tradePairAddress
} from '$lib/addresses/contracts.sepolia.json';
import { derived } from 'svelte/store';
import { BigNumber } from 'ethers';
import { isInitialized } from './client';

const liquidityPoolContract = () =>
	getContract({
		address: liquidityPoolAddress,
		abi: liquidityPoolAbi,
		signerOrProvider: getProvider()
	});

export const totalSupply = derived(
	isInitialized,
	($isInitialized, set) => {
		if (!$isInitialized) return;

		liquidityPoolContract()
			.totalSupply()
			.then((totalSupply) => {
				set(totalSupply);
			});
	},
	BigNumber.from('0')
);

export const totalAssets = derived(
	isInitialized,
	($isInitialized, set) => {
		if (!$isInitialized) return;

		liquidityPoolContract()
			.totalAssets()
			.then((totalAssets) => {
				set(totalAssets);
			});
	},
	BigNumber.from('0')
);

export const tradePairBalance = derived(
	isInitialized,
	($isInitialized, set) => {
		if (!$isInitialized) return;

		liquidityPoolContract()
			.balanceOf(/** @type {import('abitype').Address} Address */ (tradePairAddress))
			.then((tradePairBalance) => {
				set(tradePairBalance);
			});
	},
	BigNumber.from('0')
);
