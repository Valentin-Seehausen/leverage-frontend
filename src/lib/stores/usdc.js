import { readContract, waitForTransaction, writeContract } from '@wagmi/core';

import { account } from './wallet';
import { get, writable } from 'svelte/store';

import { toast } from '@zerodevx/svelte-toast';
import { addresses } from './addresses';
import { fetchSignerOrWarn } from '$lib/utils/signer';
import { parseAbi } from 'viem';

const createUserUsdcStore = () => {
	const initialState = {
		balance: 0n,
		allowance: 0n
	};
	let state = initialState;
	const { subscribe, set } = writable(state);

	const fetchValues = () => {
		const userAddress = get(account).address;
		if (!userAddress) return;

		readContract({
			address: get(addresses).addresses.usdc,
			abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
			functionName: 'balanceOf',
			args: [userAddress]
		}).then((balance) => {
			state.balance = balance;
			set(state);
		});

		readContract({
			address: get(addresses).addresses.usdc,
			abi: parseAbi(['function allowance(address, address) view returns (uint256)']),
			functionName: 'allowance',
			args: [userAddress, get(addresses).addresses.liquidityPool]
		}).then((allowance) => {
			state.allowance = allowance;
			set(state);
		});
	};

	return {
		subscribe,
		requestUpdate: () => {
			fetchValues();
		}
	};
};

export const userUsdc = createUserUsdcStore();

/**
 * @param {import('viem').Address} userAddress
 */
export const getAllowance = (userAddress) => {
	return readContract({
		address: get(addresses).addresses.usdc,
		abi: parseAbi(['function allowance(address, address) view returns (uint256)']),
		functionName: 'allowance',
		args: [userAddress, get(addresses).addresses.liquidityPool]
	});
};

export const increaseAllowance = async (/** @type {bigint} */ amount) => {
	const signer = await fetchSignerOrWarn();
	if (!signer) return;

	const tx = await writeContract({
		address: get(addresses).addresses.usdc,
		abi: parseAbi(['function increaseAllowance(address, uint256)']),
		functionName: 'increaseAllowance',
		args: [get(addresses).addresses.liquidityPool, amount]
	});

	const txToast = toast.push('Waiting for USDC Allowance Transaction...', {
		initial: 0,
		classes: ['info']
	});

	await waitForTransaction(tx);

	toast.pop(txToast);

	toast.push('Allowance Increased', {
		duration: 2000,
		classes: ['success']
	});

	userUsdc.requestUpdate();

	return;
};
