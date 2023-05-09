import { getContract, getProvider } from '@wagmi/core';
import priceFeedABI from '$lib/abis/AggregatorProxy';
import aggregatorAbi from '$lib/abis/OffChainAggregator';

import { CHAINLINK_BTC } from '$lib/addresses/contracts.mumbai.json';
import { isInitialized } from './client';
import { derived } from 'svelte/store';
import { BigNumber } from 'ethers';

export const currentPrice = derived(
	isInitialized,
	($isInitialized, set) => {
		if (!$isInitialized) return;

		const priceFeed = getContract({
			address: CHAINLINK_BTC,
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
