import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { userUsdc, getAllowance, increaseAllowance } from './usdc';
import { leverageDecimals } from '$lib/config/constants';
import { closeablePositions } from './positions/closeablePositions';
import { get } from 'svelte/store';
import { fetchSignerOrWarn } from '$lib/utils/signer';
import { parseAbi, parseUnits } from 'viem';
import { addresses } from './addresses';
import { transactionLog } from './transactionLog';
import { config } from './client';

/**
 * Opens a position at TradePair via Signer
 * @param {bigint} collateral
 * @param {number} leverage
 * @param {boolean} isLong
 */
export const openPosition = async (collateral, leverage, isLong) => {
	// @ts-ignore
	const parsedLeverage = parseUnits(leverage.toString(), leverageDecimals);

	const signer = await fetchSignerOrWarn();
	if (!signer) return;

	const allowance = await getAllowance(await signer.account.address);

	if (collateral > allowance) {
		await increaseAllowance(collateral * 100n);
	}

	const hash = await writeContract(config, {
		address: get(addresses).addresses.tradePair,
		abi: parseAbi(['function openPosition(uint256, uint256, bool)']),
		functionName: 'openPosition',
		args: [collateral, parsedLeverage, isLong]
	});

	transactionLog.add({ hash, message: 'Open Position' });

	await waitForTransactionReceipt(config, { hash });

	userUsdc.requestUpdate();
};

export const closeCloseablePositions = async () => {
	const signer = await fetchSignerOrWarn();
	if (!signer) return;

	const ids = get(closeablePositions);

	const hash = await writeContract(config, {
		address: get(addresses).addresses.tradePair,
		abi: parseAbi(['function closePositions(uint256[])']),
		functionName: 'closePositions',
		args: [ids]
	});

	transactionLog.add({ hash, message: 'House Keeping' });

	await waitForTransactionReceipt(config, { hash });

	closeablePositions.reset();
};
