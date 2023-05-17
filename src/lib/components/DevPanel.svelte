<script>
	import { account } from '$lib/stores/wallet';
	import { dev, devAddress } from '$lib/config/constants';
	import { toggleDevPrice } from '$lib/stores/priceFeed';

	// Hardcoded bc. dev
	$: isAdmin = $account.address === devAddress;
</script>

{#if dev}
	<div class="box">
		<h2 class="box-head">DEV Panel</h2>
		<div class="boc-content">
			<div class="text-sm info-label text-center mt-6 mb-3">
				Toggle price to simulate liquidations and profits.
			</div>
		</div>

		<div class="box-action">
			<button on:click={toggleDevPrice} class="user-button w-full mt-6" disabled={!isAdmin}>
				{#if !isAdmin}
					Not DEV
				{:else}
					Toggle DEV Price
				{/if}
			</button>
		</div>
	</div>
{/if}
