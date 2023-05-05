import { getContract, getProvider } from '@wagmi/core';
import liquidityPoolAbi from '$lib/abis/LiquidityPool';
import {
	liquidityPool as liquidityPoolAddress,
	tradePair as tradePairAddress
} from '$lib/addresses/contracts.sepolia.json';
import { derived } from 'svelte/store';
import { BigNumber } from 'ethers';
import { isInitialized } from './client';
import { account } from './wallet';

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
			.balanceOf(tradePairAddress)
			.then((tradePairBalance) => {
				set(tradePairBalance);
			});
	},
	BigNumber.from('0')
);

export const liquidityPoolRatio = derived(
	[totalAssets, totalSupply],
	([$totalAssets, $totalSupply], set) => {
		if ($totalAssets.isZero() || $totalSupply.isZero()) {
			set(BigNumber.from('0'));
			return;
		}

		set($totalSupply.div($totalAssets));
	}
);

export const userShares = derived(
	[isInitialized, account],
	([$isInitialized, $account], set) => {
		if (!$isInitialized) return;
		if (!$account.isConnected) return;

		liquidityPoolContract()
			.balanceOf($account.address)
			.then((userBalance) => {
				set(userBalance);
			});
	},
	BigNumber.from('0')
);

export const userAssets = derived(
	[userShares, liquidityPoolRatio],
	([$userShares, $liquidityPoolRatio], set) => {
		if ($userShares.isZero() || $liquidityPoolRatio.isZero()) {
			set(BigNumber.from('0'));
			return;
		}
		set($userShares.mul($liquidityPoolRatio));
	}
);
