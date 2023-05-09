import { fetchSigner } from '@wagmi/core';
import { tradePair as tradePairAddress } from '$lib/addresses/contracts.mumbai.json';
import { derived } from 'svelte/store';
import { BigNumber } from 'ethers';
import { isInitialized } from './client';
import { account } from './wallet';
import { toast } from '@zerodevx/svelte-toast';
import { getLiquidityPoolContract } from '$lib/utils/contracts';

/**
 * This store is used to run the other contract reading stores after a liquidity pool update
 * It also makes sure the wagmi client is initialized by returning 0 before
 * I updates max once per block
 */
export const liquitityPoolLastUpdate = derived(
	isInitialized,
	($isInitialized, set) => {
		if (!$isInitialized) return;

		const liquidityPoolInstance = getLiquidityPoolContract();

		liquidityPoolInstance.on('Transfer', (_from, _to, _amount, event) => {
			set(event.blockNumber);
		});

		// set to 1 to trigger the first update
		set(1);

		return () => {
			liquidityPoolInstance.removeAllListeners();
		};
	},
	0
);

export const totalSupply = derived(
	liquitityPoolLastUpdate,
	($liquitityPoolLastUpdate, set) => {
		if ($liquitityPoolLastUpdate == 0) return;

		getLiquidityPoolContract()
			.totalSupply()
			.then((totalSupply) => {
				set(totalSupply);
			});
	},
	BigNumber.from('0')
);

export const totalAssets = derived(
	liquitityPoolLastUpdate,
	($liquitityPoolLastUpdate, set) => {
		if ($liquitityPoolLastUpdate == 0) return;

		getLiquidityPoolContract()
			.totalAssets()
			.then((totalAssets) => {
				set(totalAssets);
			});
	},
	BigNumber.from('0')
);

export const tradePairBalance = derived(
	liquitityPoolLastUpdate,
	($liquitityPoolLastUpdate, set) => {
		if ($liquitityPoolLastUpdate == 0) return;

		getLiquidityPoolContract()
			.balanceOf(tradePairAddress)
			.then((tradePairBalance) => {
				set(tradePairBalance);
			});
	},
	BigNumber.from('0')
);

export const userShares = derived(
	[liquitityPoolLastUpdate, account],
	([$liquitityPoolLastUpdate, $account], set) => {
		if ($liquitityPoolLastUpdate == 0) return;
		if (!$account.isConnected) return;

		getLiquidityPoolContract()
			.balanceOf($account.address)
			.then((userBalance) => {
				set(userBalance);
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

export const userAssets = derived(
	[userShares, liquidityPoolRatio],
	([$userShares, $liquidityPoolRatio], set) => {
		if ($userShares.isZero() || $liquidityPoolRatio.isZero()) {
			set(BigNumber.from('0'));
			return;
		}
		set($userShares.div($liquidityPoolRatio));
	},
	BigNumber.from('0')
);

export const redeem = async (/** @type {BigNumber} */ shares) => {
	const signer = await fetchSigner();
	if (!signer) {
		toast.push('Please connect MetaMask', {
			duration: 2000,
			classes: ['error']
		});
		return;
	}

	const tx = await getLiquidityPoolContract(signer).redeem(shares);

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
};
