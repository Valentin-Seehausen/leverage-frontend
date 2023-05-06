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
import { toast } from '@zerodevx/svelte-toast';

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
	if (!signer) {
		toast.push('Please connect MetaMask', {
			duration: 2000,
			classes: ['error']
		});
		return;
	}

	const allowance = await getAllowance(await signer.getAddress());

	if (parsedCollateral > allowance) {
		await increaseAllowance(collateral * 100);
	}

	let tradePair = getContract({
		address: tradePairAddress,
		abi: tradePairAbi,
		signerOrProvider: signer
	});

	const tx = await tradePair.openPosition(parsedCollateral, parsedLeverage, isLong);

	const txToast = toast.push('Waiting for Open Position Transaction...', {
		initial: 0,
		classes: ['info']
	});

	await tx.wait();

	toast.pop(txToast);

	toast.push('Position Opened', {
		duration: 2000,
		classes: ['success']
	});
};

export const closeCloseablePositions = async () => {
	const signer = await fetchSigner();
	if (!signer) {
		toast.push('Please connect MetaMask', {
			duration: 2000,
			classes: ['error']
		});
		return;
	}

	const ids = get(closeablePositionIds);

	let tradePair = getContract({
		address: tradePairAddress,
		abi: tradePairAbi,
		signerOrProvider: signer
	});

	await tradePair.closePositions(ids.map((id) => BigNumber.from(id)));
};
