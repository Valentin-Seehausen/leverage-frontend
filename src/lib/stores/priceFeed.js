import { get, readable, writable } from 'svelte/store';
import { BigNumber } from 'ethers';
import { tweened } from 'svelte/motion';
import { sineInOut } from 'svelte/easing';
import { interpolateBigNumbers } from '$lib/utils/interpolateBigNumbers';
import { priceFeedContract, priceFeedAggregatorContract } from './contracts';

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
