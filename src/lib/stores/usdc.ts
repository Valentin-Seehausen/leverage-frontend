import { getContract, getProvider, type Provider, type Signer } from '@wagmi/core';
import { parseUnits } from 'ethers/lib/utils.js';
import { fetchSigner } from '@wagmi/core';
import type { Address } from 'abitype';
import {
	usdc as usdcAddress,
	liquidityPool as liquidityPoolAddress
} from '$lib/addresses/contracts.sepolia.json';
import usdcAbi from '$lib/abis/USDC';

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
