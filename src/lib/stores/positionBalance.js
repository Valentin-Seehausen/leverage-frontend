import { gql, queryStore } from '@urql/svelte';
import { graphClientStore } from './graph';
import { get, readable } from 'svelte/store';
import { formatUnits, parseAbi } from 'viem';
import { addresses } from './addresses';
import { watchContractEvent } from '@wagmi/core';

// Position Balance gets fetched from subgraph and than updated from events

const initValue = {
	longCollateral: 0n,
	longCollateralPercentage: 0,
	longPositionCount: 0,
	longShares: 0n,
	longSharesPercentage: 0,
	shortCollateral: 0n,
	shortCollateralPercentage: 0,
	shortPositionCount: 0,
	shortShares: 0n,
	shortSharesPercentage: 0,
	totalShares: 0n,
	totalCollateral: 0n,
	longMultiplier: 0,
	shortMultiplier: 0,
	loading: true,
	/** @type {import("@urql/svelte").CombinedError | null} */ error: null
};

export const positionBalance = readable(initValue, (set) => {
	let state = initValue;
	let unsubscribeSubgraph = () => {};

	const updatePercentages = () => {
		const totalShares = BigInt(state.longShares) + BigInt(state.shortShares);
		let longSharesPercentage = 50;
		let shortSharesPercentage = 50;
		if (totalShares == 0n) {
			if (BigInt(state.longShares) > 0) longSharesPercentage = 100;
			else if (BigInt(state.shortShares) > 0) shortSharesPercentage = 100;
			else longSharesPercentage = shortSharesPercentage = 50;
		} else {
			longSharesPercentage = parseFloat(
				formatUnits(
					(BigInt(state.longShares) * 1000000000000n) / // add 12 decimals
						totalShares,
					10
				)
			);
			shortSharesPercentage = parseFloat(
				formatUnits(
					(BigInt(state.shortShares) * 1000000000000n) / // add 12 decimals
						totalShares,
					10
				)
			);
		}
		const totalCollateral = BigInt(state.longCollateral) + BigInt(state.shortCollateral);
		let longCollateralPercentage = 50;
		let shortCollateralPercentage = 50;
		if (totalCollateral > 0n) {
			longCollateralPercentage = parseFloat(
				formatUnits(
					(BigInt(state.longCollateral) * 1000000000000n) / // add 12 decimals
						totalCollateral,
					10
				)
			);
			shortCollateralPercentage = parseFloat(
				formatUnits(
					(BigInt(state.shortCollateral) * 1000000000000n) / // add 12 decimals
						totalCollateral,
					10
				)
			);
		} else {
			if (BigInt(state.longCollateral) > 0) longCollateralPercentage = 100;
			else if (BigInt(state.shortCollateral) > 0) shortCollateralPercentage = 100;
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

	const unwatchOpen = watchContractEvent(
		{
			address: get(addresses).addresses.tradePair,
			abi: parseAbi([
				'event PositionOpened(address indexed trader,uint256 positionId,uint256 collateral,uint256 shares,uint256 leverage,bool isLong,uint256 entryPrice,uint256 liquidationPrice,uint256 takeProfitPrice,uint256 openDate)'
			]),
			eventName: 'PositionOpened'
		},
		(log) => {
			log.forEach(({ args: { collateral, shares, isLong } }) => {
				if (isLong) {
					state = {
						...state,
						longPositionCount: state.longPositionCount + 1,
						longShares: state.longShares + shares * 2n,
						longCollateral: state.longCollateral + collateral
					};
				} else {
					state = {
						...state,
						shortPositionCount: state.shortPositionCount + 1,
						shortShares: state.shortShares + shares * 2n,
						shortCollateral: state.shortCollateral + collateral
					};
				}
			});
			updatePercentages();
			set(state);
		}
	);

	const unwatchClose = watchContractEvent(
		{
			address: get(addresses).addresses.tradePair,
			abi: parseAbi([
				'event PositionClosed(address indexed trader,uint256 positionId,bool isLong,uint256 shares,uint256 entryPrice,uint256 leverage,int256 pnlShares,uint256 closePrice,uint256 closeDate)'
			]),
			eventName: 'PositionClosed'
		},
		(log) => {
			log.forEach(({ args: { shares, isLong } }) => {
				if (isLong) {
					state = {
						...state,
						longPositionCount: state.longPositionCount - 1,
						longShares: state.longShares - shares * 2n
					};
				} else {
					state = {
						...state,
						shortPositionCount: state.shortPositionCount - 1,
						shortShares: state.shortShares - shares * 2n
					};
				}
			});
			updatePercentages();
			set(state);
		}
	);

	const unsubscribeGraphStore = graphClientStore.subscribe(($graphClient) => {
		if (!$graphClient) {
			unsubscribeSubgraph = () => {};
			return;
		}

		unsubscribeSubgraph = queryStore({
			client: $graphClient,
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
			variables: { id: get(addresses).addresses.tradePair.toLowerCase() }
		}).subscribe((result) => {
			if (result.data) {
				const tradePair = result.data.tradePair;
				state = {
					...state,
					loading: false,
					longPositionCount: Number(tradePair.longPositionCount),
					longCollateral: BigInt(tradePair.longCollateral),
					longShares: BigInt(tradePair.longShares),
					shortCollateral: BigInt(tradePair.shortCollateral),
					shortPositionCount: Number(tradePair.shortPositionCount),
					shortShares: BigInt(tradePair.shortShares)
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
	});

	return () =>
		Promise.all([unwatchOpen(), unwatchClose(), unsubscribeSubgraph(), unsubscribeGraphStore()]);
});
