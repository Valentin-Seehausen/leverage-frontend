<script>
	import * as dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { leverageDecimals, priceFeedDecimals, usdcDecimals } from '$lib/config/constants';
	import { formatPercentage, formatValue } from '$lib/utils/format';

	dayjs.extend(relativeTime);

	/** @type {import("$lib/utils/position").Position[]} */
	export let positions;

	/** @type {string} */
	export let show;

	/** @type {string[]} */
	let expandedOpenPositions = [];
	/** @type {string[]} */
	let expandedClosedPositions = [];

	/** @param {string} positionId */
	const toggle = (positionId) => {
		if (show === 'open') {
			if (expandedOpenPositions.includes(positionId)) {
				expandedOpenPositions = expandedOpenPositions.filter((id) => id !== positionId);
			} else {
				expandedOpenPositions = [...expandedOpenPositions, positionId];
			}
		} else if (show === 'closed') {
			if (expandedClosedPositions.includes(positionId)) {
				expandedClosedPositions = expandedClosedPositions.filter((id) => id !== positionId);
			} else {
				expandedClosedPositions = [...expandedClosedPositions, positionId];
			}
		}
	};

	$: isExpanded = (/** @type {string} */ positionId) => {
		if (show === 'open') {
			return expandedOpenPositions.includes(positionId);
		} else if (show === 'closed') {
			return expandedClosedPositions.includes(positionId);
		}
		return false;
	};
</script>

<div>
	<table class="min-w-full table-auto">
		<thead>
			<tr>
				<th class=" pl-2 py-2 text-left">Type</th>
				<th class=" px-0 py-2 text-right">Leverage</th>
				<th class=" px-2 py-2 text-right">Collateral</th>
				<th class=" px-2 py-2 text-right">Entry Price</th>
				{#if show === 'open'}
					<th class=" px-2 py-2 text-right">Liquidation Price</th>
					<th class=" px-2 py-2 text-right">Take Profit Price</th>
				{:else if show === 'closed'}
					<th class=" px-2 py-2 text-right">Close Price</th>
					<th class=" px-2 py-2 text-right">PnL</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each positions as position, index (position.id)}
				<tr
					class={`position-row cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 ${
						index % 2 == 0 ? 'dark:bg-slate-800 dark:bg-opacity-50' : ''
					}`}
					on:click={() => toggle(position.id)}
				>
					<td class="pl-2 px-0 py-2">
						<span
							class={`font-bold text-lg ${position.isLong ? 'text-green-600' : 'text-red-700'}`}
						>
							{position.isLong ? 'LONG' : 'SHORT'}
						</span>
					</td>
					<td class=" px-0 py-2 text-right">
						<span class="font-mono"
							>{formatValue(position.leverage, leverageDecimals, 0, { showSymbol: false })}x</span
						>
					</td>
					<td class=" px-2 py-2 text-right">
						<span class="font-mono">{formatValue(position.collateral, usdcDecimals, 2)}</span>
					</td>
					<td class=" px-2 py-2 text-right">
						<span class="font-mono">{formatValue(position.entryPrice, priceFeedDecimals, 2)}</span>
					</td>
					{#if position.isOpen}
						<td class=" px-2 py-2 text-right">
							<span class="font-mono"
								>{formatValue(position.liquidationPrice, priceFeedDecimals, 2)}</span
							>
						</td>
						<td class=" px-2 py-2 text-right">
							<span class="font-mono"
								>{formatValue(position.takeProfitPrice, priceFeedDecimals, 2)}</span
							>
						</td>
					{:else}
						<td class=" px-2 py-2 text-right">
							<span class="font-mono">{formatValue(position.closePrice, priceFeedDecimals, 2)}</span
							>
						</td>
						<td
							colspan="3"
							class={`px-2 py-2 text-right font-extrabold ${
								position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
							}`}
						>
							{formatPercentage(position.pnlSharesPercentage)}
						</td>
					{/if}
				</tr>

				{#if isExpanded(position.id)}
					<tr
						class={`bg-gray-100  ${
							index % 2 == 0 ? 'dark:bg-slate-800 dark:bg-opacity-50' : 'dark:bg-slate-900'
						}`}
					>
						<td colspan="3" class="pl-2 py-2 mb-6">
							<span class="info-label">Opened:</span>
							{new Date(position.openDate * 1000).toLocaleString()}
							{#if !position.isOpen}
								<br />
								<span class="info-label">Closed:</span>
								{new Date(position.closeDate * 1000).toLocaleString()}
							{/if}
						</td>
						{#if position.isOpen}
							<td
								colspan="3"
								class={`pr-2 py-2 mb-6 text-right font-extrabold ${
									position.pnlSharesPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
								}`}
							>
								{formatPercentage(position.pnlSharesPercentage)}
							</td>
						{:else}
							<td colspan="3" class="pr-2 py-2 mb-6 text-right">
								<span class="info-label">Asset PnL:</span>
								<span
									class={`font-extrabold ${
										position.pnlAssetsPercentage >= 0 ? 'dark:text-green-600' : 'dark:text-red-700'
									}`}
								>
									{formatPercentage(position.pnlAssetsPercentage)}
								</span>
							</td>
						{/if}
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>
