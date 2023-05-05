import { getContract, getProvider } from '@wagmi/core';
import { parseUnits } from 'ethers/lib/utils.js';
import { fetchSigner } from '@wagmi/core';

import {
	usdc as usdcAddress,
	liquidityPool as liquidityPoolAddress
} from '$lib/addresses/contracts.sepolia.json';
import usdcAbi from '$lib/abis/USDC';
import { account } from './wallet';
import { derived } from 'svelte/store';
import { BigNumber } from 'ethers';

const usdcContract = async () =>
	getContract({
		address: usdcAddress,
		abi: usdcAbi,
		signerOrProvider: (await fetchSigner()) || getProvider()
	});

export const increaseAllowance = async (/** @type {number} */ amount) => {
	let signer = await fetchSigner();
	if (!signer) throw new Error('no signer');

	let usdc = getContract({
		address: usdcAddress,
		abi: usdcAbi,
		signerOrProvider: signer
	});

	return usdc.increaseAllowance(liquidityPoolAddress, parseUnits(amount.toString(), 6));
};

export const getAllowance = (/** @type {string} */ address) => {
	return usdcContract().then((usdc) => {
		return usdc.allowance(address, liquidityPoolAddress);
	});
};

export const userBalance = derived(
	account,
	($account, set) => {
		if (!$account.isConnected) return;

		const fetchBalance = async () => {
			(await usdcContract()).balanceOf($account.address).then((balance) => {
				set(balance);
			});
		};

		fetchBalance();
	},
	BigNumber.from('0')
);
