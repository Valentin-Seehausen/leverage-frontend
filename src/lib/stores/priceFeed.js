import { getContract, getProvider } from '@wagmi/core';
import priceFeedABI from '$lib/abis/AggregatorProxy';
import aggregatorAbi from '$lib/abis/OffChainAggregator';

import { isInitialized } from './client';
import { derived, readable } from 'svelte/store';
import { BigNumber } from 'ethers';
import { tweened } from 'svelte/motion';
import { sineInOut } from 'svelte/easing';
import { interpolateBigNumbers } from '$lib/utils/interpolateBigNumbers';
import { addresses } from '$lib/stores/addresses';

export const currentPriceUpdate = derived(
	[isInitialized, addresses],
	([$isInitialized, $addresses], set) => {
		if (!$isInitialized) return;

		const priceFeed = getContract({
			address: $addresses.addresses.priceFeed,
			abi: priceFeedABI,
			signerOrProvider: getProvider()
		});

		// Set initial Value
		priceFeed.latestRoundData().then((data) => {
			set(data.answer);
		});

		let close = () => {};

		// SetUp listener and add subscription to close
		priceFeed.aggregator().then((aggregatorAddress) => {
			const aggregator = getContract({
				address: aggregatorAddress,
				abi: aggregatorAbi,
				signerOrProvider: getProvider()
			});

			aggregator.on('AnswerUpdated', (answer) => {
				set(answer);
			});

			close = () => {
				aggregator.removeAllListeners();
			};
		});

		return () => {
			close();
		};
	},
	BigNumber.from(0)
);

export const currentPrice = readable(BigNumber.from(0), (set) => {
	let lastPrice = BigNumber.from(0);
	let tween = tweened(lastPrice, {
		duration: 200,
		easing: sineInOut,
		interpolate: interpolateBigNumbers
	});
	const unsubscribeTween = tween.subscribe((value) => {
		set(value);
	});
	const unsubscribe = currentPriceUpdate.subscribe((newCurrentPrice) => {
		if (!newCurrentPrice.eq(lastPrice)) {
			lastPrice = newCurrentPrice;
			tween.set(newCurrentPrice);
		}
	});
	return () => {
		unsubscribeTween();
		unsubscribe();
	};
});
