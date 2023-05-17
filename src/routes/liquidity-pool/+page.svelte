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
	import { positionBalance } from '$lib/stores/positionBalance';
	import { formatUnits, parseUnits } from 'viem';
	import HouseKeepingButton from '$lib/components/HouseKeepingButton.svelte';

	let withdrawAssets = '0';

	// It is called withdraw at the UI, but we use the redeem function
	const callRedeem = () => {
		// @ts-ignore
		const redeemShares = BigInt(parseUnits(withdrawAssets, usdcDecimals)) * $liquidityPoolRatio;
		redeem(redeemShares);
	};
</script>

<div class="max-w-screen-2xl min-h-full m-auto xl:p-3 md:mt-24">
	<HouseKeepingButton />

	<div class="lg:flex">
		<div class="lg:basis-2/3 xl:basis-3/4">
			<div class="box">
				<h2 class="box-head">Total</h2>

				<div class="box-content">
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
						<div class="basis-1/3 info-label text-right">
							{formatValue($positionBalance.totalCollateral, usdcDecimals)}
						</div>
					</div>
					<div class="flex flex-row">
						<div class="basis-2/3 info-label">Locked Shares:</div>
						<div class="basis-1/3 info-label text-right">
							{formatValue($tradePairBalance, liquidityPoolDecimals, 2, { showSymbol: false })}
						</div>
					</div>
				</div>
			</div>

			<div class="box">
				<h2 class="box-head">You</h2>

				<div class="box-content">
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
		</div>

		<div class="lg:basis-1/3 xl:basis-1/4">
			<div class="box">
				<h2 class="box-head">Withdraw</h2>

				<div class="box-content">
					<label class="block">
						<div class="flex content-between w-full">
							<span class="info-label text-sm grow" />
							<button
								class="info-label text-sm opacity-50"
								on:click={() => (withdrawAssets = formatUnits($userAssets, usdcDecimals))}
								>Max: {formatValue($userAssets, usdcDecimals)}</button
							>
						</div>
						<input class="user-input" type="text" bind:value={withdrawAssets} />
					</label>

					<p class="info-label text-xs mt-6">
						You can always withdraw your shares. A protocol fee of 1% will apply to incentivice
						liquidity provision. The only way to provide liquidity is to profit from a successful
						trade. Only ex-traders can become liquidity providers.
					</p>
				</div>

				<div class="box-action">
					<button on:click={callRedeem}>Withdraw</button>
				</div>
			</div>
		</div>
	</div>
</div>
