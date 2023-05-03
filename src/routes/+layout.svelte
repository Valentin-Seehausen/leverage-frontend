<script>
	import WalletConnectButton from '$lib/components/WalletConnectButton.svelte';
	import '../app.css';

	let displayMobile = false;
</script>

<nav class="hidden lg:flex place-content-between lg:place-content-end lg:gap-6 px-8 py-4">
	<h1 class="flex-1 justify-center text-3xl font-bold flex-2 mb-4 lg:mb-0 font-heading">
		P2P Leverage
	</h1>
	<a class="nav-button" href="/">Trading</a>
	<a class="nav-button" href="/wallet">Wallet</a>
	<a class="nav-button" href="/liquidity-pool">Liquidity Pool</a>
	<WalletConnectButton />
</nav>

<nav class="lg:hidden dark:bg-slate-800">
	<div class="flex lg:hidden place-content-between lg:place-content-end px-6 py-5">
		<button
			on:click={() => {
				displayMobile = !displayMobile;
			}}
		>
			Menu
		</button>
		<WalletConnectButton />
	</div>
	<div class="flex flex-col p-3" class:flex={displayMobile} class:hidden={!displayMobile}>
		<a class="nav-button" href="/">Trading</a>
		<a class="nav-button" href="/wallet">Wallet</a>
		<a class="nav-button" href="/liquidity-pool">Liquidity Pool</a>
	</div>
</nav>

<div class="max-w-screen-2xl m-auto xl:p-3">
	<slot />
</div>
