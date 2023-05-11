import { waitForTransaction } from '@wagmi/core';

import { account } from './wallet';
import { get, writable } from 'svelte/store';
import { BigNumber } from 'ethers';
import { toast } from '@zerodevx/svelte-toast';
import { contracts, usdcContract } from '$lib/stores/contracts';
import { addresses } from './addresses';
import { fetchSignerOrWarn } from '$lib/utils/signer';

const createUserUsdcStore = () => {
	const initialState = {
		balance: BigNumber.from('0'),
		allowance: BigNumber.from('0')
	};
	let state = initialState;
	/** @type{string | null} */
	let address = null;
	const { subscribe, set } = writable(state);

	let usdc = get(usdcContract);
	usdcContract.subscribe((newUsdc) => {
		usdc = newUsdc;
	});

	let liquidityPoolAddress = get(addresses).addresses.liquidityPool;
	addresses.subscribe(($addresses) => {
		liquidityPoolAddress = $addresses.addresses.liquidityPool;
	});

	account.subscribe(($account) => {
		address = null;
		if (!$account.isConnected) return;
		address = $account.address;
		fetchValues();
	});

	const fetchValues = () => {
		if (!address) return;
		usdc.balanceOf(address).then((balance) => {
			state.balance = balance;
			set(state);
		});

		usdc.allowance(address, liquidityPoolAddress).then((allowance) => {
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

export const getAllowance = (/** @type {string} */ address) => {
	return get(usdcContract).allowance(address, get(addresses).addresses.liquidityPool);
};

export const increaseAllowance = async (/** @type {BigNumber} */ amount) => {
	const signer = await fetchSignerOrWarn();
	if (!signer) return;

	let usdc = get(contracts).getUsdcContract(signer);

	const tx = await usdc.increaseAllowance(get(addresses).addresses.liquidityPool, amount);

	const txToast = toast.push('Waiting for USDC Allowance Transaction...', {
		initial: 0,
		classes: ['info']
	});

	// @ts-ignore
	await waitForTransaction({ hash: tx.hash });

	toast.pop(txToast);

	toast.push('Allowance Successful', {
		duration: 2000,
		classes: ['success']
	});

	userUsdc.requestUpdate();

	return;
};
