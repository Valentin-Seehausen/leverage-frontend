import { fetchSigner, waitForTransaction } from '@wagmi/core';
import { parseUnits } from 'ethers/lib/utils.js';
import { userUsdc, getAllowance, increaseAllowance } from './usdc';
import { leverageDecimals } from '$lib/config/constants';
import { closeablePositions } from './positions/closeablePositions';
import { BigNumber } from 'ethers';
import { get } from 'svelte/store';
import { toast } from '@zerodevx/svelte-toast';
import { getTradePairContract } from '$lib/utils/contracts';

/**
 * Opens a position at TradePair via Signer
 * @param {BigNumber} collateral
 * @param {number} leverage
 * @param {boolean} isLong
 */
export const openPosition = async (collateral, leverage, isLong) => {
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

	if (collateral.gt(allowance)) {
		await increaseAllowance(collateral.mul(100));
	}

	let tradePair = getTradePairContract(signer);

	const tx = await tradePair.openPosition(collateral, parsedLeverage, isLong);

	const txToast = toast.push('Waiting for Open Position Transaction...', {
		initial: 0,
		classes: ['info']
	});

	// @ts-ignore
	await waitForTransaction({ hash: tx.hash });

	toast.pop(txToast);

	toast.push('Position Opened', {
		duration: 2000,
		classes: ['success']
	});

	userUsdc.requestUpdate();
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

	const ids = get(closeablePositions);

	let tradePair = getTradePairContract(signer);

	const tx = await tradePair.closePositions(ids.map((id) => BigNumber.from(id)));

	const txToast = toast.push('Waiting for House Keeping Transaction...', {
		initial: 0,
		classes: ['info']
	});

	// @ts-ignore
	await waitForTransaction({ hash: tx.hash });

	toast.pop(txToast);

	toast.push('House Keeping successful', {
		duration: 2000,
		classes: ['success']
	});

	closeablePositions.reset();
};
