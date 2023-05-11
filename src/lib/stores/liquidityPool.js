import { fetchSigner, waitForTransaction } from '@wagmi/core';
import { derived, get } from 'svelte/store';
import { BigNumber } from 'ethers';
import { isInitialized } from './client';
import { account } from './wallet';
import { toast } from '@zerodevx/svelte-toast';
import { contracts } from '$lib/stores/contracts';
import { userUsdc } from '$lib/stores/usdc';
import { addresses } from './addresses';

/**
 * This store is used to run the other contract reading stores after a liquidity pool update
 * It also makes sure the wagmi client is initialized by returning 0 before
 * I updates max once per block
 */
export const liquitityPoolLastUpdate = derived(
	[isInitialized, contracts],
	([$isInitialized, $contracts], set) => {
		if (!$isInitialized) return;

		const liquidityPoolInstance = $contracts.getLiquidityPoolContract();

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
	[liquitityPoolLastUpdate, contracts],
	([$liquitityPoolLastUpdate, $contracts], set) => {
		if ($liquitityPoolLastUpdate == 0) return;

		$contracts
			.getLiquidityPoolContract()
			.totalSupply()
			.then((totalSupply) => {
				set(totalSupply);
			});
	},
	BigNumber.from('0')
);

export const totalAssets = derived(
	[liquitityPoolLastUpdate, contracts],
	([$liquitityPoolLastUpdate, $contracts], set) => {
		if ($liquitityPoolLastUpdate == 0) return;

		$contracts
			.getLiquidityPoolContract()
			.totalAssets()
			.then((totalAssets) => {
				set(totalAssets);
			});
	},
	BigNumber.from('0')
);

export const tradePairBalance = derived(
	[liquitityPoolLastUpdate, contracts, addresses],
	([$liquitityPoolLastUpdate, $contracts, $addresses], set) => {
		if ($liquitityPoolLastUpdate == 0) return;

		$contracts
			.getLiquidityPoolContract()
			.balanceOf($addresses.addresses.tradePair)
			.then((tradePairBalance) => {
				set(tradePairBalance);
			});
	},
	BigNumber.from('0')
);

export const userShares = derived(
	[liquitityPoolLastUpdate, contracts, account],
	([$liquitityPoolLastUpdate, $contracts, $account], set) => {
		if ($liquitityPoolLastUpdate == 0) return;
		if (!$account.isConnected) return;

		$contracts
			.getLiquidityPoolContract()
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

	const tx = await get(contracts).getLiquidityPoolContract(signer).redeem(shares);

	const txToast = toast.push('Waiting for Withdraw Transaction...', {
		initial: 0,
		classes: ['info']
	});

	// @ts-ignore
	await waitForTransaction({ hash: tx.hash });

	toast.pop(txToast);

	toast.push('Withdraw Successful', {
		duration: 2000,
		classes: ['success']
	});

	userUsdc.requestUpdate();
};
