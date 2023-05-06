import { getContract } from '@wagmi/core';
import { fetchSigner } from '@wagmi/core';
import { parseUnits } from 'ethers/lib/utils.js';
import tradePairAbi from '$lib/abis/TradePair';
import { tradePair as tradePairAddress } from '$lib/addresses/contracts.sepolia.json';
import { getAllowance, increaseAllowance } from './usdc';
import { leverageDecimals, usdcDecimals } from '$lib/config/constants';
import { closeablePositionIds } from './closeablePositions';
import { BigNumber } from 'ethers';
import { get } from 'svelte/store';

/**
 * Opens a position at TradePair via Signer
 * @param {number} collateral
 * @param {number} leverage
 * @param {boolean} isLong
 */
export const openPosition = async (collateral, leverage, isLong) => {
	const parsedCollateral = parseUnits(collateral.toString(), usdcDecimals);
	const parsedLeverage = parseUnits(leverage.toString(), leverageDecimals);

	const signer = await fetchSigner();
	if (!signer) throw new Error('no signer');

	const allowance = await getAllowance(await signer.getAddress());

	if (parsedCollateral > allowance) {
		await (await increaseAllowance(collateral * 100)).wait();
	}

	let tradePair = getContract({
		address: tradePairAddress,
		abi: tradePairAbi,
		signerOrProvider: signer
	});

	await tradePair.openPosition(parsedCollateral, parsedLeverage, isLong);
};

export const closeCloseablePositions = async () => {
	const signer = await fetchSigner();
	if (!signer) throw new Error('no signer');

	const ids = get(closeablePositionIds);

	let tradePair = getContract({
		address: tradePairAddress,
		abi: tradePairAbi,
		signerOrProvider: signer
	});

	await tradePair.closePositions(ids.map((id) => BigNumber.from(id)));
};
