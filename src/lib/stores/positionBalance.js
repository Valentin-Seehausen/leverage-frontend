import { gql, queryStore } from '@urql/svelte';
import { graphClient } from './graph';
import { tradePair as tradePairAddress } from '$lib/addresses/contracts.mumbai.json';
import { readable } from 'svelte/store';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';
import { getTradePairContract } from '$lib/utils/contracts';

const initValue = {
	longCollateral: '0',
	longCollateralPercentage: 0,
	longPositionCount: 0,
	longShares: '0',
	longSharesPercentage: 0,
	shortCollateral: '0',
	shortCollateralPercentage: 0,
	shortPositionCount: 0,
	shortShares: '0',
	shortSharesPercentage: 0,
	totalShares: BigNumber.from('0'),
	totalCollateral: BigNumber.from('0'),
	loading: true,
	/** @type {import("@urql/svelte").CombinedError | null} */ error: null
};

export const positionBalance = readable(initValue, (set) => {
	let state = initValue;

	const updatePercentages = () => {
		const totalShares = BigNumber.from(state.longShares).add(BigNumber.from(state.shortShares));
		let longSharesPercentage = 0;
		let shortSharesPercentage = 0;
		if (!totalShares.isZero()) {
			longSharesPercentage = parseFloat(
				formatUnits(
					BigNumber.from(state.longShares)
						.mul(BigNumber.from('1000000000000')) // add 12 decimals
						.div(totalShares),
					10
				)
			);
			shortSharesPercentage = parseFloat(
				formatUnits(
					BigNumber.from(state.shortShares)
						.mul(BigNumber.from('1000000000000')) // add 12 decimals
						.div(totalShares),
					10
				)
			);
		} else {
			if (BigNumber.from(state.longShares).gt(0)) longSharesPercentage = 100;
			else if (BigNumber.from(state.shortShares).gt(0)) shortSharesPercentage = 100;
			else longSharesPercentage = shortSharesPercentage = 50;
		}
		const totalCollateral = BigNumber.from(state.longCollateral).add(
			BigNumber.from(state.shortCollateral)
		);
		let longCollateralPercentage = 0;
		let shortCollateralPercentage = 0;
		if (!totalCollateral.isZero()) {
			longCollateralPercentage = parseFloat(
				formatUnits(
					BigNumber.from(state.longCollateral)
						.mul(BigNumber.from('1000000000000')) // add 12 decimals
						.div(totalCollateral),
					10
				)
			);
			shortCollateralPercentage = parseFloat(
				formatUnits(
					BigNumber.from(state.shortCollateral)
						.mul(BigNumber.from('1000000000000')) // add 12 decimals
						.div(totalCollateral),
					10
				)
			);
		} else {
			if (BigNumber.from(state.longCollateral).gt(0)) longCollateralPercentage = 100;
			else if (BigNumber.from(state.shortCollateral).gt(0)) shortCollateralPercentage = 100;
			else longCollateralPercentage = shortCollateralPercentage = 50;
		}

		state = {
			...state,
			longSharesPercentage,
			shortSharesPercentage,
			totalShares,
			longCollateralPercentage,
			shortCollateralPercentage,
			totalCollateral
		};
	};

	const unsubscribeSubgraph = queryStore({
		client: graphClient,
		query: gql`
			query TradePair($id: ID!) {
				tradePair(id: $id) {
					longPositionCount
					longCollateral
					longShares
					shortCollateral
					shortPositionCount
					shortShares
				}
				_meta {
					block {
						number
					}
				}
			}
		`,
		variables: { id: tradePairAddress.toLowerCase() }
	}).subscribe((result) => {
		if (result.data) {
			const tradePair = result.data.tradePair;
			state = {
				...state,
				loading: false,
				...tradePair
			};
			updatePercentages();

			set(state);
		} else if (result.fetching) {
			set({ ...initValue, loading: true });
		} else if (result.error) {
			set({ ...initValue, error: result.error });
		} else {
			set({ ...initValue, loading: false });
		}
	});

	const tradePairContract = getTradePairContract();

	tradePairContract.on(
		'PositionOpened',
		(_trader, _positionId, collateral, shares, _leverage, isLong) => {
			if (isLong) {
				state = {
					...state,
					longPositionCount: state.longPositionCount + 1,
					longShares: BigNumber.from(state.longShares).add(shares.mul(2)).toString(),
					longCollateral: BigNumber.from(state.longCollateral).add(collateral).toString()
				};
			} else {
				state = {
					...state,
					shortPositionCount: state.shortPositionCount + 1,
					shortShares: BigNumber.from(state.shortShares).add(shares.mul(2)).toString(),
					shortCollateral: BigNumber.from(state.shortCollateral).add(collateral).toString()
				};
			}
			updatePercentages();
			set(state);
		}
	);

	tradePairContract.on('PositionClosed', (_trader, _positionId, isLong, shares) => {
		console.log('PositionClosed', _trader, _positionId, isLong, shares.toString());
		if (isLong) {
			state = {
				...state,
				longPositionCount: state.longPositionCount - 1,
				longShares: BigNumber.from(state.longShares).sub(shares.mul(2)).toString()
			};
		} else {
			state = {
				...state,
				shortPositionCount: state.shortPositionCount - 1,
				shortShares: BigNumber.from(state.shortShares).sub(shares.mul(2)).toString()
			};
		}
		updatePercentages();
		set(state);
	});

	return () => Promise.all([unsubscribeSubgraph(), tradePairContract.removeAllListeners()]);
});
