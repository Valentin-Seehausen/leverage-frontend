import { gql, queryStore } from '@urql/svelte';
import { graphClient } from './graph';
import { tradePair as tradePairAddress } from '$lib/addresses/contracts.mumbai.json';
import { readable } from 'svelte/store';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';

const initValue = {
	longCollateral: 0,
	longCollateralPercentage: 0,
	longPositionCount: 0,
	longShares: 0,
	longSharesPercentage: 0,
	shortCollateral: 0,
	shortCollateralPercentage: 0,
	shortPositionCount: 0,
	shortShares: 0,
	shortSharesPercentage: 0,
	totalShares: 0,
	totalCollateral: 0,
	loading: true,
	/** @type {import("@urql/svelte").CombinedError | null} */ error: null
};

export const positionBalance = readable(initValue, (set) => {
	const unsubscribe = queryStore({
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
			}
		`,
		variables: { id: tradePairAddress.toLowerCase() }
	}).subscribe((result) => {
		if (result.data) {
			const tradePair = result.data.tradePair;
			const totalShares = BigNumber.from(tradePair.longShares).add(
				BigNumber.from(tradePair.shortShares)
			);
			let longSharesPercentage = 0;
			let shortSharesPercentage = 0;
			if (!totalShares.isZero()) {
				longSharesPercentage = parseFloat(
					formatUnits(
						BigNumber.from(tradePair.longShares)
							.mul(BigNumber.from('1000000000000')) // add 12 decimals
							.div(totalShares),
						10
					)
				);
				shortSharesPercentage = parseFloat(
					formatUnits(
						BigNumber.from(tradePair.shortShares)
							.mul(BigNumber.from('1000000000000')) // add 12 decimals
							.div(totalShares),
						10
					)
				);
			}
			const totalCollateral = BigNumber.from(tradePair.longCollateral).add(
				BigNumber.from(tradePair.shortCollateral)
			);
			let longCollateralPercentage = 0;
			let shortCollateralPercentage = 0;
			if (!totalCollateral.isZero()) {
				longCollateralPercentage = parseFloat(
					formatUnits(
						BigNumber.from(tradePair.longCollateral)
							.mul(BigNumber.from('1000000000000')) // add 12 decimals
							.div(totalCollateral),
						10
					)
				);
				shortCollateralPercentage = parseFloat(
					formatUnits(
						BigNumber.from(tradePair.shortCollateral)
							.mul(BigNumber.from('1000000000000')) // add 12 decimals
							.div(totalCollateral),
						10
					)
				);
			}

			set({
				...tradePair,
				longSharesPercentage,
				shortSharesPercentage,
				totalShares,
				longCollateralPercentage,
				shortCollateralPercentage,
				totalCollateral,
				loading: false
			});
		} else if (result.fetching) {
			set({ ...initValue, loading: true });
		} else if (result.error) {
			set({ ...initValue, error: result.error });
		} else {
			set({ ...initValue, loading: false });
		}
	});

	return unsubscribe;
});
