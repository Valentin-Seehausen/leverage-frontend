<script>
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import HouseKeepingButton from '$lib/components/HouseKeepingButton.svelte';

	import Nav from './Nav.svelte';
	import '../app.postcss';
	import { Client, setContextClient, cacheExchange, fetchExchange } from '@urql/svelte';
	import { positionDetailsDialog } from '$lib/stores/positionDetailsModal';
	import ModalContainer from '$lib/components/positions/ModalContainer.svelte';

	// Toast Options
	/** @type {import("@zerodevx/svelte-toast/stores").SvelteToastOptions} */
	const options = {
		classes: ['log']
	};

	const client = new Client({
		url: 'https://api.studio.thegraph.com/query/46177/p2p-leverage-operations/v0.0.4',
		exchanges: [cacheExchange, fetchExchange]
	});

	setContextClient(client);
</script>

<Nav />
<ModalContainer />
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
	<div class="">
		<div class="lg:flex">
			<div class="flex-1 lg:flex">
				<HouseKeepingButton />
			</div>
		</div>

		<main class:modalOpen={$positionDetailsDialog.expanded}>
			<slot />
		</main>
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

	<div class="toast-wrap">
		<SvelteToast {options} />
	</div>
</div>

<footer
	class="info-label relative text-xs text-center py-12 pb-24 md:pb-12 dark:bg-valhalla-900/90 font-light dark:text-valhalla-100/50 border-t dark:border-valhalla-700"
>
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
