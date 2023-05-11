<script>
	import { account } from '$lib/stores/wallet';
	import { dev } from '$lib/config/constants';
	import { toggleDevPrice } from '$lib/stores/priceFeed';

	// Hardcoded bc. dev
	$: isAdmin = $account.address === '0xfd08B2027F61893Ee2090E76eF157bdC56eF3e40';
</script>

{#if dev}
	<div class="box">
		<h2 class="font-semibold font-heading mb-3">DEV Panel</h2>

		<button on:click={toggleDevPrice} class="user-button w-full mt-6" disabled={!isAdmin}>
			{#if !isAdmin}
				Not DEV
			{:else}
				Toggle DEV Price
			{/if}
		</button>
		<div class="text-sm info-label text-center mt-6 mb-3">
			Toggle price to simulate liquidations and profits.
		</div>
	</div>
{/if}
