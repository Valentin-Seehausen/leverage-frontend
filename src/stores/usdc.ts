import { getContract, getProvider, type Provider, type Signer } from '@wagmi/core';
import usdcAbi from './abis/USDC';
import { parseUnits } from 'ethers/lib/utils.js';
import { fetchSigner } from '@wagmi/core';
import {
	usdc as usdcAddress,
	liquidityPool as liquidityPoolAddress
} from '$lib/config/contracts.sepolia.json';
import type { Address } from 'abitype';

export const increaseAllowance = async (amount: number) => {
	let signer = await fetchSigner();
	if (!signer) throw new Error('no signer');

	let usdc = getContract({
		address: usdcAddress,
		abi: usdcAbi,
		signerOrProvider: signer
	});
	return usdc.increaseAllowance(liquidityPoolAddress as Address, parseUnits(amount.toString(), 6));
};
