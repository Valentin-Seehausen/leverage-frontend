import { parseUnits } from 'ethers/lib/utils.js';
import { fetchSigner, waitForTransaction } from '@wagmi/core';

import { liquidityPool as liquidityPoolAddress } from '$lib/addresses/contracts.mumbai.json';
import { account } from './wallet';
import { writable } from 'svelte/store';
import { BigNumber } from 'ethers';
import { toast } from '@zerodevx/svelte-toast';
import { getUsdcContract } from '$lib/utils/contracts';

const createUserUsdcStore = () => {
	const initialState = {
		balance: BigNumber.from('0'),
		allowance: BigNumber.from('0')
	};
	let state = initialState;
	/** @type{string | null} */
	let address = null;
	const { subscribe, set } = writable(state);

	account.subscribe(($account) => {
		address = null;
		if (!$account.isConnected) return;
		address = $account.address;
		fetchValues();
	});

	const fetchValues = () => {
		if (!address) return;
		getUsdcContract()
			.balanceOf(address)
			.then((balance) => {
				state.balance = balance;
				set(state);
			});

		getUsdcContract()
			.allowance(address, liquidityPoolAddress)
			.then((allowance) => {
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
	return getUsdcContract().allowance(address, liquidityPoolAddress);
};

export const increaseAllowance = async (/** @type {number} */ amount) => {
	let signer = await fetchSigner();
	if (!signer) throw new Error('no signer');

	let usdc = getUsdcContract(signer);

	const tx = await usdc.increaseAllowance(liquidityPoolAddress, parseUnits(amount.toString(), 6));

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
