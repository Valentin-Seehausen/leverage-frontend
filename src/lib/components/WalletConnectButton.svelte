<script>
	import { account, connectWallet } from '$lib/stores/wallet';
</script>

{#if $account.isConnected}
	<button class="user-button" on:click={connectWallet}>
		{$account.shortAddress}
	</button>
{:else}
	<button
		class="user-button dark:bg-secondary-700 dark:hover:bg-secondary-800"
		on:click={connectWallet}
	>
		Connect Wallet
	</button>
{/if}
