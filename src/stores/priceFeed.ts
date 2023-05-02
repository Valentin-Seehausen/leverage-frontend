import { getContract, getProvider, readContract, watchReadContract } from '@wagmi/core';
import { writable } from 'svelte/store';
import priceFeedABI from './abis/AggregatorProxy';
import aggregatorAbi from './abis/OffChainAggregator';
import { formatUnits } from 'ethers/lib/utils.js';
import type { BigNumber } from 'ethers';

const BTC_PRICE_FEED = '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43';

export const createPriceFeedStore = () => {
	const subscriptions: Set<(value: any) => void> = new Set();
	let currentPrice = 'loading...';
	let priceFeed: any;
	let aggregatorAddress: string;
	let aggregator: any;

	const init = async () => {
		if (!typeof aggregator === undefined) return;

		priceFeed = getContract({
			address: BTC_PRICE_FEED,
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

export const priceFeedStore = createPriceFeedStore();
