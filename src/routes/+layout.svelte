<script>
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import Nav from './Nav.svelte';
	import '../app.postcss';
	import { positionDetailsDialog } from '$lib/stores/positionDetailsModal';
	import ModalContainer from '$lib/components/positions/ModalContainer.svelte';
	import TransactionLog from '$lib/components/TransactionLog.svelte';

	// Toast Options
	/** @type {import("@zerodevx/svelte-toast/stores").SvelteToastOptions} */
	const options = {
		classes: ['log']
	};
</script>

<Nav />
<ModalContainer />
<div class="fixed md:hidden top-6 right-6 z-10">
	<TransactionLog />
</div>

<div class="min-h-screen isolate">
	<!-- Upper Scroll background -->
	<div class="fixed inset-x-0 -z-10 transform-gpu blur-3xl sm:-top-80" aria-hidden="true">
		<div
			class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-900 md:from-primary-600 to-valhalla-900 md:to-valhalla-700 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
			style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
		/>
	</div>

	<!-- Lower Scroll background -->
	<div class="fixed inset-x-0 -z-10 transform-gpu blur-3xl sm:-bottom-80" aria-hidden="true">
		<div
			class="relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/2 rotate-[60deg] bg-gradient-to-tr from-primary-900 md:from-primary-600 to-valhalla-900 md:to-valhalla-700 opacity-30 sm:right-[calc(50%-30rem)] sm:w-[72.1875rem]"
			style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
		/>
	</div>

	<div
		class="fixed inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
		aria-hidden="true"
	>
		<div
			class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-400 to-valhalla-400 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
			style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
		/>
	</div>

	<div class="">
		<main class:modalOpen={$positionDetailsDialog.expanded}>
			<slot />
		</main>
	</div>

	<div class="toast-wrap">
		<SvelteToast {options} />
	</div>
</div>

<footer
	class="info-label relative text-xs text-center px-3 py-24 dark:bg-valhalla-900/90 font-light dark:text-valhalla-100/50 border-t dark:border-valhalla-700"
>
	<div class="max-w-screen-lg m-auto flex my-6 justify-center">
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
	</div>
	<div class="max-w-screen-lg m-auto">
		<h2 class="heading font-semibold">Hyperbolic Trading</h2>

		<p class="mt-6">
			Experience the future of decentralized finance with Hyperbolic Trading, a state-of-the-art P2P
			synthetic margin trading protocol. Powered by a unique hyperbolic incentive structure, we
			drive towards unparalleled balance in long and short positions, optimizing protocol health and
			maximizing your trading potential. Our commitment to pushing the boundaries of
			decentralization and democratization of profit aims to revolutionize the crypto trading
			landscape. We strive to facilitate nearly fee-free trading, with a mission to cut costs by
			90%, making trading more accessible and profitable for our users.
		</p>

		<p class="mt-6">
			<span class="font-semibold">Disclaimer:</span> Trading involves risk, including possible loss of
			principal. The information provided by Hyperbolic Trading does not constitute investment advice,
			financial advice, trading advice, or any other sort of advice, and you should not treat any of
			the website&apos;s content as such. Hyperbolic Trading does not recommend that any cryptocurrency
			should be bought, sold, or held by you. Always conduct your own due diligence before making any
			investment decisions. Hyperbolic Trading is governed by a Decentralized Autonomous Organization
			(DAO), which ensures the protocol operates in a decentralized and democratic manner. However, being
			a DAO does not exempt users from their individual responsibilities. All users are expected to be
			responsible and cautious in their trading activities.
		</p>

		<p class="mt-6">Trade responsibly, and welcome to the future of decentralized trading.</p>

		<p class="mt-6"><a href="/terms/imprint">Imprint</a></p>
		<p class="mt-6"><a href="/terms/privacy">Data Privacy Policy</a></p>
	</div>
</footer>

<style>
	:global(._toastContainer) {
		--toastContainerTop: auto;
		--toastContainerBottom: 2rem;
	}
	:global(.log.info) {
		--toastBackground: theme(colors.yellow.700);
		--toastBarBackground: theme(colors.yellow.600);
	}
	:global(.log.error) {
		--toastBackground: theme(colors.red.800);
		--toastBarBackground: theme(colors.red.700);
	}
	:global(.log.success) {
		--toastBackground: theme(colors.green.600);
		--toastBarBackground: theme(colors.green.500);
	}
</style>
