import { get, readable, writable } from 'svelte/store';
import { BigNumber } from 'ethers';
import { tweened } from 'svelte/motion';
import { sineInOut } from 'svelte/easing';
import { interpolateBigNumbers } from '$lib/utils/interpolateBigNumbers';
import { priceFeedContract, priceFeedAggregatorContract } from './contracts';
import { fetchSigner, waitForTransaction } from '@wagmi/core';
import { toast } from '@zerodevx/svelte-toast';
import { parseUnits } from 'ethers/lib/utils.js';

const createCurrentPriceStore = () => {
	const { subscribe, set } = writable(BigNumber.from(0));

	let priceFeed = get(priceFeedContract);

	/**
	 * @type {{ removeAllListeners: () => void; on: (arg0: string, arg1: (answer: any) => void) => void; }}
	 */
	let priceFeedAggregator;

	priceFeedContract.subscribe(($priceFeedContract) => {
		priceFeed.removeAllListeners();
		priceFeed = $priceFeedContract;

		priceFeed.latestRoundData().then((data) => {
			set(data.answer);
		});
	});

	priceFeedAggregatorContract.subscribe(($priceFeedAggregator) => {
		if (priceFeedAggregator) priceFeedAggregator.removeAllListeners();
		if (!$priceFeedAggregator) return;

		priceFeedAggregator = $priceFeedAggregator;
		priceFeedAggregator.on('AnswerUpdated', (answer) => {
			set(answer);
		});
	});

	return {
		subscribe
	};
};

export const currentPriceUpdate = createCurrentPriceStore();

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

export const toggleDevPrice = async () => {
	const signer = await fetchSigner();
	if (!signer) {
		toast.push('Please connect MetaMask', {
			duration: 2000,
			classes: ['error']
		});
		return;
	}

	const price1 = parseUnits('60000', 8);
	const price2 = parseUnits('61000', 8);

	const newPrice = get(currentPriceUpdate).eq(price1) ? price2 : price1;

	const tx = await get(priceFeedAggregatorContract).connect(signer).setNewPrice(newPrice);

	const txToast = toast.push('Waiting for Price Update Transaction...', {
		initial: 0,
		classes: ['info']
	});

	// @ts-ignore
	await waitForTransaction({ hash: tx.hash });

	toast.pop(txToast);

	toast.push('Price Updated', {
		duration: 2000,
		classes: ['success']
	});
};
