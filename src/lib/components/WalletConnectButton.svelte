<script>
	import { account, connectWallet } from '$lib/stores/wallet';
	import { transactionLog } from '$lib/stores/transactionLog';
	import TransactionLog from './TransactionLog.svelte';
</script>

{#if $account.isConnected}
	{#if $transactionLog.length > 0}
		<TransactionLog />
	{:else}
		<button class="user-button" on:click={connectWallet}>
			{$account.shortAddress}
		</button>
	{/if}
{:else}
	<button
		class="user-button dark:bg-secondary-700 dark:hover:bg-secondary-800"
		on:click={connectWallet}
	>
		Connect Wallet
	</button>
{/if}
