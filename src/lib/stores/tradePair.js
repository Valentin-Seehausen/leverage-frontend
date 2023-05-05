import { getContract } from '@wagmi/core';
import { fetchSigner } from '@wagmi/core';
import { parseUnits } from 'ethers/lib/utils.js';
import tradePairAbi from '$lib/abis/TradePair';
import { tradePair as tradePairAddress } from '$lib/addresses/contracts.sepolia.json';

export const openPosition = async (
	/** @type {number} */ collateral,
	/** @type {number} */ leverage,
	/** @type {boolean} */ isLong
) => {
	let signer = await fetchSigner();
	if (!signer) return;

	let tradePair = getContract({
		address: tradePairAddress,
		abi: tradePairAbi,
		signerOrProvider: signer
	});
	await tradePair.openPosition(
		parseUnits(collateral.toString(), 6),
		parseUnits(leverage.toString(), 6),
		isLong
	);
};
