import { getWalletClient, readContract, waitForTransaction, writeContract } from '@wagmi/core';

import { account } from './wallet';
import { get, writable } from 'svelte/store';

import { addresses } from './addresses';
import { fetchSignerOrWarn } from '$lib/utils/signer';
import { parseAbi } from 'viem';
import { usdcDecimals } from '$lib/config/constants';
import { transactionLog } from './transactionLog';
import { config } from './client';

const createUserUsdcStore = () => {
	const initialState = {
		balance: 0n,
		allowance: 0n,
		fetchingBalance: true
	};
	let state = initialState;
	/** @type {import('viem').Address | undefined} */
	let userAddress;
	const { subscribe, set } = writable(state);

	const fetchValues = () => {
		if (!userAddress) return;

		set(state);
		readContract(config, {
			address: get(addresses).addresses.usdc,
			abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
			functionName: 'balanceOf',
			args: [userAddress]
		}).then((balance) => {
			state.balance = balance;
			state.fetchingBalance = false;
			set(state);
		});

		readContract(config, {
			address: get(addresses).addresses.usdc,
			abi: parseAbi(['function allowance(address, address) view returns (uint256)']),
			functionName: 'allowance',
			args: [userAddress, get(addresses).addresses.liquidityPool]
		}).then((allowance) => {
			state.allowance = allowance;
			set(state);
		});
	};

	account.subscribe((account) => {
		userAddress = account.address;
		fetchValues();
	});

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
	return readContract(config, {
		address: get(addresses).addresses.usdc,
		abi: parseAbi(['function allowance(address, address) view returns (uint256)']),
		functionName: 'allowance',
		args: [userAddress, get(addresses).addresses.liquidityPool]
	});
};

export const increaseAllowance = async (/** @type {bigint} */ amount) => {
	const signer = await fetchSignerOrWarn();
	if (!signer) return;

	const hash = await writeContract(config, {
		address: get(addresses).addresses.usdc,
		abi: parseAbi(['function increaseAllowance(address, uint256)']),
		functionName: 'increaseAllowance',
		args: [get(addresses).addresses.liquidityPool, amount]
	});

	transactionLog.add({ hash, message: 'Approve TestUSDC' });

	await waitForTransaction(config, { hash });

	userUsdc.requestUpdate();

	return;
};

export const requestFunds = async () => {
	const signer = await fetchSignerOrWarn();
	if (!signer) return;

	const hash = await writeContract(config, {
		address: get(addresses).addresses.faucet,
		abi: parseAbi(['function requestFunds()']),
		functionName: 'requestFunds'
	});

	transactionLog.add({ hash, message: 'Requesting Funds' });

	await waitForTransaction(config, { hash });

	userUsdc.requestUpdate();

	return;
};

export const addUsdcToWallet = async () => {
	const walletClient = await getWalletClient(config);

	if (!walletClient) return;

	await walletClient.watchAsset({
		type: 'ERC20',
		options: {
			address: get(addresses).addresses.usdc,
			decimals: usdcDecimals,
			symbol: 'USDCT'
		}
	});
};
