import { getContract, getProvider, type Provider, type Signer } from '@wagmi/core';
import tradePairAbi from './abis/TradePair';
import { parseUnits } from 'ethers/lib/utils.js';
import { fetchSigner } from '@wagmi/core';

import { wallet } from './wallet';

let tradePairAddress = '0x7993E8565870CCE53Bd031bA064B228B90DEe57d';

export const openPosition = async (collateral: number, leverage: number, isLong: boolean) => {
	let signer = await fetchSigner();
	if (!signer) return;

	let tradePair = getContract({
		address: tradePairAddress,
		abi: tradePairAbi,
		signerOrProvider: signer
	});
	console.log(
		'opening position',
		parseUnits(collateral.toString(), 6),
		parseUnits(collateral.toString(), 6),
		isLong
	);
	await tradePair.openPosition(
		parseUnits(collateral.toString(), 6),
		parseUnits(collateral.toString(), 6),
		isLong
	);
	console.log('position opened');
};
