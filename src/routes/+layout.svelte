<script>
	import WalletConnectButton from '$lib/components/WalletConnectButton.svelte';
	import Nav from './Nav.svelte';
	import '../app.css';
</script>

<Nav />

<div class="max-w-screen-2xl m-auto xl:p-3">
	<slot />
</div>
