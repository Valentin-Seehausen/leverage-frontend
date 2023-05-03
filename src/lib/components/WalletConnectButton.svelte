<script>
	import { wallet } from '$lib/stores/wallet';

	let toggleConnection = () => {
		if ($wallet.isConnected) {
			wallet.disconnect();
		} else {
			wallet.connect();
		}
	};
</script>

<button class="user-button" on:click={toggleConnection}>
	{#if $wallet.isConnected}
		{$wallet.shortAddress}
	{:else}
		Connect Wallet
	{/if}
</button>
