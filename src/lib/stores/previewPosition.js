import { derived, writable } from 'svelte/store';
import { liquidityPoolRatio } from './liquidityPool';
import { positionBalance } from './positionBalance';
import { formatUnits } from 'viem';

const initialState = {
	collateral: 0n,
	isLong: true
};

export const previewPosition = writable(initialState);

export const previewLongPercentage = derived(
	[previewPosition, liquidityPoolRatio, positionBalance],
	([$previewPosition, $liquidityPoolRatio, $positionBalance]) => {
		if ($positionBalance.totalShares == 0n) return $positionBalance.longSharesPercentage;
		const addedLongShares = $previewPosition.isLong
			? $previewPosition.collateral * $liquidityPoolRatio
			: 0n;
		const newLongShares = $positionBalance.longShares + addedLongShares;
		const newTotalShares =
			$positionBalance.totalShares + $previewPosition.collateral * $liquidityPoolRatio;
		const newLongSharesPercentage = parseFloat(
			formatUnits(
				(BigInt(newLongShares) * 1000000000000n) / // add 12 decimals
					newTotalShares,
				10
			)
		);
		return newLongSharesPercentage;
	}
);
