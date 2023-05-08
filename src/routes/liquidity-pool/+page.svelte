<script>
	import {
		totalSupply,
		totalAssets,
		tradePairBalance,
		userShares,
		userAssets,
		liquidityPoolRatio,
		redeem
	} from '$lib/stores/liquidityPool';
	import { liquidityPoolDecimals, usdcDecimals } from '$lib/config/constants';
	import { formatValue } from '$lib/utils/format';
	import { formatUnits, parseUnits } from 'ethers/lib/utils.js';
	import { BigNumber } from 'ethers';
	import { positionBalance } from '$lib/stores/positionBalance';

	let withdrawAssets = 0;

	// It is called withdraw at the UI, but we use the redeem function
	const callRedeem = () => {
		const redeemShares = BigNumber.from(parseUnits(withdrawAssets.toString(), usdcDecimals)).mul(
			$liquidityPoolRatio
		);
		redeem(redeemShares);
	};
</script>

<div class="p-3 mb-3">
	<h1 class="headline">Liquidity Pool</h1>
</div>

<div class="lg:flex">
	<div class="lg:basis-2/3 xl:basis-3/4">
		<div class="box">
			<h2 class="font-heading mb-3">Total</h2>

			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Assets:</div>
				<div class="basis-1/3 text-right">{formatValue($totalAssets, usdcDecimals)}</div>
			</div>
			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Shares:</div>
				<div class="basis-1/3 text-right">
					{formatValue($totalSupply, liquidityPoolDecimals, 2, { showSymbol: false })}
				</div>
			</div>
			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Locked Assets:</div>
				<div class="basis-1/3 text-right">
					{formatValue($positionBalance.totalCollateral, usdcDecimals)}
				</div>
			</div>
			<div class="flex flex-row">
				<div class="basis-2/3 info-label">Locked Shares:</div>
				<div class="basis-1/3 text-right">
					{formatValue($tradePairBalance, liquidityPoolDecimals, 2, { showSymbol: false })}
				</div>
			</div>
		</div>

		<div class="box">
			<h2 class="mb-3">You</h2>

			<div class="flex">
				<div class="basis-2/3 info-label">Assets:</div>
				<div class="basis-1/3 text-right">{formatValue($userAssets, usdcDecimals)}</div>
			</div>
			<div class="flex">
				<div class="basis-2/3 info-label">Shares:</div>
				<div class="basis-1/3 text-right">
					{formatValue($userShares, liquidityPoolDecimals, 2, { showSymbol: false })}
				</div>
			</div>
		</div>
	</div>
	<div class="lg:basis-1/3 xl:basis-1/4">
		<div class="box">
			<label class="block">
				<div class="flex content-between">
					<span class="info-label text-sm grow">Withdraw USDC</span>
					<button
						class="info-label text-sm opacity-50"
						on:click={() => (withdrawAssets = parseInt(formatUnits($userAssets, usdcDecimals)))}
						>Max: {formatValue($userAssets, usdcDecimals)}</button
					>
				</div>
				<input class="user-input" type="text" bind:value={withdrawAssets} />
			</label>

			<button class="w-full user-button mt-6" on:click={callRedeem}>Withdraw</button>
		</div>
		<div class="p-3 my-3">
			<p class="info-label text-sm">
				You can always withdraw your shares. A protocol fee of 1% will apply to incentivice
				liquidity provision. The only way to provide liquidity is to profit from a successful trade.
				Only ex-traders can become liquidity providers.
			</p>
		</div>
	</div>
</div>
