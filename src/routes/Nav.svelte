<script>
	import { slide } from 'svelte/transition';

	import { Hamburger } from 'svelte-hamburgers';
	import WalletConnectButton from '$lib/components/WalletConnectButton.svelte';
	import { clickOutside } from '$lib/utils/clickOutside';

	let open = false;
	let toggle = () => {
		open = !open;
	};
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

<nav class="lg:hidden dark:bg-slate-800" use:clickOutside on:outclick={() => (open = false)}>
	<div class="flex lg:hidden place-content-between lg:place-content-end px-6 py-5">
		<Hamburger
			bind:open
			--color="white"
			--padding="0"
			--layer-width="30px"
			--layer-height="3px"
			--layer-spacing="7px"
			--border-radius="1px"
		/>
		<WalletConnectButton />
	</div>
	{#if open}
		<div class="flex flex-col p-3" transition:slide>
			<a class="nav-button" on:click={toggle} href="/">Trading</a>
			<a class="nav-button" on:click={toggle} href="/wallet">Wallet</a>
			<a class="nav-button" on:click={toggle} href="/liquidity-pool">Liquidity Pool</a>
		</div>
	{/if}
</nav>
