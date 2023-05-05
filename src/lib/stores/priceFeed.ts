import {
	getContract,
	getProvider,
	readContract,
	watchReadContract,
	type Address
} from '@wagmi/core';
import priceFeedABI from '$lib/abis/AggregatorProxy';
import aggregatorAbi from '$lib/abis/OffChainAggregator';
import { formatUnits } from 'ethers/lib/utils.js';
import type { BigNumber } from 'ethers';
import { CHAINLINK_BTC } from '$lib/addresses/contracts.sepolia.json';
import { isInitialized } from './client';
import { derived } from 'svelte/store';

export const createPriceFeedStore = () => {
	const subscriptions: Set<(value: any) => void> = new Set();
	let currentPrice = 'loading...';
	let priceFeed: any;
	let aggregatorAddress: string;
	let aggregator: any;

	const init = async () => {
		if (!typeof aggregator === undefined) return;

		priceFeed = getContract({
			address: CHAINLINK_BTC,
			abi: priceFeedABI,
			signerOrProvider: getProvider()
		});

		aggregatorAddress = await priceFeed.aggregator();

		aggregator = getContract({
			address: aggregatorAddress,
			abi: aggregatorAbi,
			signerOrProvider: getProvider()
		});
	};

	function update(newPrice: BigNumber) {
		currentPrice = formatUnits(newPrice, 8);
		subscriptions.forEach((subscription) => subscription(currentPrice));
	}

	const open = async () => {
		if (subscriptions.size === 0) {
			await init();
			await priceFeed.latestAnswer().then(update);
			await aggregator.on('AnswerUpdated', update);
		}
	};

	function close() {
		aggregator.removeAllListeners();
	}

	return {
		subscribe(subscription: (value: any) => void) {
			open();
			subscription(currentPrice);
			subscriptions.add(subscription);
			return () => {
				subscriptions.delete(subscription);
				if (subscriptions.size === 0) {
					close();
				}
			};
		}
	};
};

export const currentPrice = createPriceFeedStore();
