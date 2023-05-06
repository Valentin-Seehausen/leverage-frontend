import { fetchSigner, getContract, getProvider } from '@wagmi/core';
import liquidityPoolAbi from '$lib/abis/LiquidityPool';
import {
	liquidityPool as liquidityPoolAddress,
	tradePair as tradePairAddress
} from '$lib/addresses/contracts.sepolia.json';
import { derived } from 'svelte/store';
import { BigNumber } from 'ethers';
import { isInitialized } from './client';
import { account } from './wallet';
import { toast } from '@zerodevx/svelte-toast';

const liquidityPoolContract = (
	/** @type {import('@wagmi/core').Provider | import('@wagmi/core').Signer}  */ signerOrProvider = getProvider()
) =>
	getContract({
		address: liquidityPoolAddress,
		abi: liquidityPoolAbi,
		signerOrProvider
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
		set($userShares.div($liquidityPoolRatio));
	}
);

export const redeem = async (/** @type {BigNumber} */ shares) => {
	const signer = await fetchSigner();
	if (!signer) throw new Error('no signer');

	const tx = await liquidityPoolContract(signer).redeem(shares);

	const txToast = toast.push('Waiting for Withdraw Transaction...', {
		initial: 0,
		classes: ['info']
	});

	await tx.wait();

	toast.pop(txToast);

	toast.push('Withdraw Successful', {
		duration: 2000,
		classes: ['success']
	});

	// await new Promise((r) => setTimeout(r, 200000));

	// // await tx.wait();
};
