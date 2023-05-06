import { queryStore, gql } from '@urql/svelte';
import { account } from './wallet';
import { graphClient } from './graph';
import { derived } from 'svelte/store';
import { currentPrice } from './priceFeed';
import { BigNumber } from 'ethers';

export const openUserPositions = derived(
	[account, currentPrice],
	([$account, $currentPrice], set) => {
		const unsubscribe = queryStore({
			client: graphClient,
			query: gql`
				query ($trader: String!) {
					positions(where: { and: [{ trader: $trader }, { isOpen: true }] }) {
						id
						collateral
						shares
						isLong
						liquidationPrice
						takeProfitPrice
						entryPrice
						isLong
						leverage
						openDate
					}
				}
			`,
			variables: { trader: $account.address.toLowerCase() || '' }
		}).subscribe((result) => {
			if (result.data) {
				result.data.position = result.data.positions.map(
					(
						/** @type {{ isLong: any; pnl: import("ethers").BigNumber; entryPrice: import("ethers").BigNumberish; leverage: import("ethers").BigNumberish; collateral: import("ethers").BigNumberish; }} */ position
					) => {
						if (position.isLong) {
							position.pnl = $currentPrice
								.sub(position.entryPrice)
								.mul(100) // make it a percentage
								.mul(BigNumber.from('1000000000000')) // add 12 decimals
								.mul(position.leverage) // add 6 decimals from leverage
								.div(position.entryPrice);
						} else {
							position.pnl = BigNumber.from(position.entryPrice)
								.sub($currentPrice)
								.mul(100) // make it a percentage
								.mul(BigNumber.from('1000000000000')) // add 12 decimals
								.mul(position.leverage) // add 6 decimals from leverage
								.div(position.entryPrice);
						}

						return position;
					}
				);
			}
			set(result);
		});

		return unsubscribe;
	}
);

export const closedUserPositions = derived(account, ($account, set) => {
	const unsubscribe = queryStore({
		client: graphClient,
		query: gql`
			query ($trader: String!) {
				positions(where: { and: [{ trader: $trader }, { isOpen: false }] }) {
					id
					collateral
					shares
					isLong
					liquidationPrice
					takeProfitPrice
					entryPrice
					isLong
					leverage
					openDate
					closeDate
					pnl
				}
			}
		`,
		variables: { trader: $account.address.toLowerCase() || '' }
	}).subscribe(set);

	return unsubscribe;
});
