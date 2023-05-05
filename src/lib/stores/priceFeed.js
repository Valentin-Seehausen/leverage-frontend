import { getContract, getProvider } from '@wagmi/core';
import priceFeedABI from '$lib/abis/AggregatorProxy';
import aggregatorAbi from '$lib/abis/OffChainAggregator';

import { CHAINLINK_BTC } from '$lib/addresses/contracts.sepolia.json';
import { isInitialized } from './client';
import { derived } from 'svelte/store';
import { BigNumber } from 'ethers';

export const currentPrice = derived(
	isInitialized,
	($isInitialized, set) => {
		let close = () => {};
		const getAggregator = async () => {
			const priceFeed = getContract({
				address: CHAINLINK_BTC,
				abi: priceFeedABI,
				signerOrProvider: getProvider()
			});

			const aggregatorAddress = await priceFeed.aggregator();

			return getContract({
				address: aggregatorAddress,
				abi: aggregatorAbi,
				signerOrProvider: getProvider()
			});
		};

		const init = async () => {
			close = () => {};
			const aggregator = await getAggregator();
			const answer = await aggregator.latestAnswer();
			set(answer);
			aggregator.on('AnswerUpdated', set);
			close = () => {
				aggregator.removeAllListeners();
			};
		};

		init();
		return () => {
			close();
		};
	},
	BigNumber.from(0)
);
