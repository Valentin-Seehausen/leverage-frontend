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

	<a class="nav-button" href="https://discord.gg/5Yp7kjxaau" target="_blank">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			fill="currentColor"
			class="bi bi-discord"
			viewBox="0 0 16 16"
		>
			<path
				d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"
			/>
		</svg>
	</a>
	<a class="nav-button" href="https://twitter.com/HyperbolicTrade" target="_blank">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			fill="currentColor"
			class="bi bi-twitter"
			viewBox="0 0 16 16"
		>
			<path
				d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"
			/>
		</svg>
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
