import { derived, get, readable } from 'svelte/store';
import { tweened } from 'svelte/motion';
import { sineInOut } from 'svelte/easing';
import { waitForTransaction, watchContractEvent, readContract, writeContract } from '@wagmi/core';
import { toast } from '@zerodevx/svelte-toast';

import { fetchSignerOrWarn } from '$lib/utils/signer';
import { addresses } from './addresses';
import { isInitialized, config } from './client';
import { parseAbi, parseUnits } from 'viem';
import { interpolateBigInts } from '$lib/utils/interpolateBigInts';

export const currentPriceUpdate = derived(
	[isInitialized, addresses],
	([$isInitialized, $addresses], set) => {
		if (!$isInitialized) return;

		readContract(config, {
			address: $addresses.addresses.priceFeed,
			abi: parseAbi([
				'function latestRoundData() view returns (uint80 roundId ,int256 answer , uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'
			]),
			functionName: 'latestRoundData'
		}).then((data) => {
			set(data[1]);
		});

		const unwatch = watchContractEvent(config, {
			address: $addresses.addresses.priceFeedAggregator,
			abi: parseAbi([
				'event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 timestamp)'
			]),
			eventName: 'AnswerUpdated',
			onLogs: (log) => {
				// return if undefined (just required for type safety)
				if (typeof log[0].args.current === 'undefined') return;
				set(log[0].args.current);
			}
		});

		return unwatch;
	},
	0n
);

export const currentPriceTweened = readable(0n, (set) => {
	let lastPrice = 0n;
	let tween = tweened(lastPrice, {
		duration: 200,
		easing: sineInOut,
		interpolate: interpolateBigInts
	});

	const unsubscribeTween = tween.subscribe((value) => {
		set(value);
	});

	const unsubscribe = currentPriceUpdate.subscribe((newCurrentPrice) => {
		if (newCurrentPrice == lastPrice) return;
		lastPrice = newCurrentPrice;
		tween.set(newCurrentPrice);
	});
	return () => {
		unsubscribeTween();
		unsubscribe();
	};
});

export const toggleDevPrice = async () => {
	const signer = await fetchSignerOrWarn();
	if (!signer) return;

	if (!signer) {
		toast.push('Please connect MetaMask', {
			duration: 2000,
			classes: ['error']
		});
		return;
	}

	const price1 = parseUnits('60000', 8);
	const price2 = parseUnits('61000', 8);

	const newPrice = get(currentPriceUpdate) == price1 ? price2 : price1;

	const hash = await writeContract(config, {
		address: get(addresses).addresses.priceFeedAggregator,
		abi: parseAbi(['function setNewPrice(int256 newPrice) public']),
		functionName: 'setNewPrice',
		args: [newPrice]
	});

	const txToast = toast.push('Waiting for Price Update Transaction...', {
		initial: 0,
		classes: ['info']
	});

	await waitForTransaction(config, { hash });

	toast.pop(txToast);

	toast.push('Price Updated', {
		duration: 2000,
		classes: ['success']
	});
};
