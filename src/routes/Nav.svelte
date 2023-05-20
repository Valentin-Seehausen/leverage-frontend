<script>
	import logo from '$lib/assets/logo-512x512.png';
	import WalletConnectButton from '$lib/components/WalletConnectButton.svelte';
	import { page } from '$app/stores';

	let scrollY = 0;
	let open = false;
	let toggle = () => {
		open = !open;
	};
</script>

<svelte:window bind:scrollY />

<!-- Medium and Large Navigation -->
<nav
	class={`hidden md:flex fixed top-0 w-full lg:h-30 z-10 place-content-end justify-center gap-6 px-8 py-4 h-30 backdrop-blur-lg transition-all border-b ${
		scrollY > 40
			? 'dark:border-valhalla-400/40  dark:bg-valhalla-700/80 shadow-xl shadow-valhalla-500/20 hover:shadow-valhalla-500/30'
			: 'dark:bg-transparent dark:border-transparent shadow-none'
	} `}
>
	<a
		href="/"
		class="inline text-left self-center flex-1 justify-center text-xl font-semibold flex-2 font-heading"
	>
		<img alt="Hyperbolic Finance Logo" src={logo} class="w-10 h-10 mr-3 inline" />
		<span class="hidden lg:inline">Hyperbolic Finance</span>
	</a>

	<a class="nav-button" href="/trading">Trading</a>
	<a class="nav-button" href="/liquidity-pool">Liquidity Pool</a>
	<WalletConnectButton />
</nav>

<!-- Small Navigation (Bottom Bar)  -->
<nav
	class="fixed justify-around items-center md:hidden bottom-0 w-full h-14 dark:border-valhalla-200/40 dark:bg-valhalla-700 shadow-xl shadow-valhalla-500/20 hover:shadow-valhalla-500/30 flex z-10 border-t"
>
	<a
		class="bottom-nav-button flex flex-col p-1 items-center"
		class:current={$page.url.pathname === '/'}
		aria-current={$page.url.pathname === '/'}
		on:click={toggle}
		href="/"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1"
			stroke="currentColor"
			class="w-5 h-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
			/>
		</svg>
		<span class="text-xs">Home</span>
	</a>
	<a
		class="bottom-nav-button flex flex-col p-1 items-center"
		class:current={$page.url.pathname === '/trading'}
		aria-current={$page.url.pathname === '/trading'}
		on:click={toggle}
		href="/trading"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1"
			stroke="currentColor"
			class="w-5 h-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
			/>
		</svg>
		<span class="text-xs">Trading</span>
	</a>
	<a
		class="bottom-nav-button flex flex-col p-1 items-center"
		class:current={$page.url.pathname === '/liquidity-pool'}
		aria-current={$page.url.pathname === '/liquidity-pool'}
		on:click={toggle}
		href="/liquidity-pool"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1"
			stroke="currentColor"
			class="w-5 h-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>

		<span class="text-xs">Payout</span>
	</a>
	<a
		class="bottom-nav-button flex flex-col p-1 items-center"
		class:current={$page.url.pathname === '/wallet'}
		aria-current={$page.url.pathname === '/wallet'}
		on:click={toggle}
		href="/wallet"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1"
			stroke="currentColor"
			class="w-5 h-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
			/>
		</svg>

		<span class="text-xs">Wallet</span>
	</a>
</nav>
