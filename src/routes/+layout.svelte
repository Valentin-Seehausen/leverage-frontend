<script>
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Modal from 'svelte-simple-modal';
	import HouseKeepingButton from '$lib/components/HouseKeepingButton.svelte';

	import Nav from './Nav.svelte';
	import '../app.postcss';
	import { Client, setContextClient, cacheExchange, fetchExchange } from '@urql/svelte';

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

<Modal
	classBg="dark:bg-slate-950"
	classContent="dark:bg-slate-800 dark:text-slate-100 border rounded dark:border-slate-700 shadow-lg dark:shadow-slate-950"
>
	<Nav />
	<main class="min-h-screen">
		<div class="max-w-screen-2xl min-h-full m-auto xl:p-3">
			<div class="lg:flex">
				<div class="flex-1 lg:flex">
					<HouseKeepingButton />
				</div>
			</div>

			<slot />
		</div>

		<div class="toast-wrap">
			<SvelteToast {options} />
		</div>
	</main>

	<footer
		class="mt-36 info-label text-xs text-center py-12 pb-24 md:pb-12 dark:bg-slate-900 font-light border-t dark:border-slate-800"
	>
		<div class="max-w-screen-lg m-auto">
			<h2 class="heading font-semibold">Hyperbolic Trading</h2>

			<p class="mt-6">
				Experience the future of decentralized finance with Hyperbolic Trading, a state-of-the-art
				P2P synthetic margin trading protocol. Powered by a unique hyperbolic incentive structure,
				we drive towards unparalleled balance in long and short positions, optimizing protocol
				health and maximizing your trading potential. Our commitment to pushing the boundaries of
				decentralization and democratization of profit aims to revolutionize the crypto trading
				landscape. We strive to facilitate nearly fee-free trading, with a mission to cut costs by
				90%, making trading more accessible and profitable for our users.
			</p>

			<p class="mt-6">
				<span class="font-semibold">Disclaimer:</span> Trading involves risk, including possible loss
				of principal. The information provided by Hyperbolic Trading does not constitute investment advice,
				financial advice, trading advice, or any other sort of advice, and you should not treat any of
				the website&apos;s content as such. Hyperbolic Trading does not recommend that any cryptocurrency
				should be bought, sold, or held by you. Always conduct your own due diligence before making any
				investment decisions. Hyperbolic Trading is governed by a Decentralized Autonomous Organization
				(DAO), which ensures the protocol operates in a decentralized and democratic manner. However,
				being a DAO does not exempt users from their individual responsibilities. All users are expected
				to be responsible and cautious in their trading activities.
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
			--toastBackground: theme(colors.amber.700);
			--toastBarBackground: theme(colors.amber.600);
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
</Modal>
