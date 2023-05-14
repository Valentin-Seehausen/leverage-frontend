<script>
	import WalletConnectButton from '$lib/components/WalletConnectButton.svelte';
</script>

<div class="p-3 mb-3">
	<h1 class="headline">Connect your wallet</h1>
</div>
<div class="p-3 pt-48 pb-12 mb-3 flex justify-center">
	<WalletConnectButton />
</div>

<div class="lg:flex">
	<div class="p-6 my-3">
		<p class="info-label text-sm">
			Please connect your MetaMask Wallet here. Currently, we only support MetaMask. Other wallet
			providers will be added soon.
		</p>
	</div>
</div>
