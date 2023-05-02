<script>
	import WalletConnectButton from './../components/WalletConnectButton.svelte';
	import { wallet } from '../../stores/wallet';
	import { priceFeedStore } from '../../stores/priceFeed';

	let open = true;
</script>

<div class="lg:flex items-center m-6 mb-12">
	<a href="/">back</a>
	<h1 class="flex-1 justify-center text-3xl font-bold flex-2 mb-4 lg:mb-0 font-heading">
		Your Wallet
	</h1>
	<div class="flex-1 align-middle items-center justify-end lg:flex">
		<WalletConnectButton />
	</div>
</div>
{#if $wallet.isConnected}
	<div class="lg:flex items-center m-6 mb-12">
		{$wallet.address}
	</div>
{/if}

{#if open}
	<button class="lg:flex items-center m-6 mb-12" on:click={() => (open = false)}>
		{$priceFeedStore}
	</button>
{/if}
