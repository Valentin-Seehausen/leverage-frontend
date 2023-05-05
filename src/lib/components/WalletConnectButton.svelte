<script>
	import { account, connectWallet } from '$lib/stores/wallet';
</script>

<button class="user-button" on:click={connectWallet}>
	{#if $account.isConnected}
		{$account.shortAddress}
	{:else}
		Connect Wallet
	{/if}
</button>
