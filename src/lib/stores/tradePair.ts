import { getContract, getProvider, type Provider, type Signer } from '@wagmi/core';
import { fetchSigner } from '@wagmi/core';
import { parseUnits } from 'ethers/lib/utils.js';
import tradePairAbi from '$lib/abis/TradePair';
import { tradePair as tradePairAddress } from '$lib/addresses/contracts.sepolia.json';

export const openPosition = async (collateral: number, leverage: number, isLong: boolean) => {
	let signer = await fetchSigner();
	if (!signer) return;

	let tradePair = getContract({
		address: tradePairAddress,
		abi: tradePairAbi,
		signerOrProvider: signer
	});
	await tradePair.openPosition(
		parseUnits(collateral.toString(), 6),
		parseUnits(collateral.toString(), 6),
		isLong
	);
};
