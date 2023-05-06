import { queryStore, gql } from '@urql/svelte';
import { account } from './wallet';
import { graphClient } from './graph';
import { derived } from 'svelte/store';
import { currentPrice } from './priceFeed';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';

/**
 * @typedef {Object} Position
 * @property {number} id
 * @property {boolean} isOpen
 * @property {boolean} isLong
 * @property {number} collateral
 * @property {string} leverage
 * @property {number} entryPrice
 * @property {number} liquidationPrice
 * @property {number} takeProfitPrice
 * @property {number} closePrice
 * @property {number} openDate
 * @property {number} closeDate
 * @property {number} pnlShares
 * @property {number} pnlSharesPercentage
 * @property {number} pnlAssets
 * @property {number} pnlAssetsPercentage
 */

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
						isOpen
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
				result.data.position = result.data.positions.map((/** @type {Position} */ position) => {
					if (position.isLong) {
						position.pnlSharesPercentage = parseFloat(
							formatUnits(
								$currentPrice
									.sub(position.entryPrice)
									.mul(100) // make it a percentage
									.mul(BigNumber.from('1000000000000')) // add 12 decimals
									.mul(position.leverage) // add 6 decimals from leverage
									.div(position.entryPrice),
								18
							)
						);
					} else {
						position.pnlSharesPercentage = parseFloat(
							formatUnits(
								BigNumber.from(position.entryPrice)
									.sub($currentPrice)
									.mul(100) // make it a percentage
									.mul(BigNumber.from('1000000000000')) // add 12 decimals
									.mul(position.leverage) // add 6 decimals from leverage
									.div(position.entryPrice),
								18
							)
						);
					}

					return position;
				});
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
					isOpen
					liquidationPrice
					takeProfitPrice
					closePrice
					entryPrice
					isLong
					leverage
					openDate
					closeDate
					pnlShares
					pnlSharesPercentage
					pnlAssets
					pnlAssetsPercentage
				}
			}
		`,
		variables: { trader: $account.address.toLowerCase() || '' }
	}).subscribe(set);

	return unsubscribe;
});
