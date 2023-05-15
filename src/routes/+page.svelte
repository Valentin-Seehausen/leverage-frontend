<script>
	import { getWalletClient } from '@wagmi/core';
	import { account, connectWallet } from '$lib/stores/wallet';
	import { arbitrumGoerli } from 'viem/chains';
	import { toast } from '@zerodevx/svelte-toast';
	import { requestFunds, userUsdc } from '$lib/stores/usdc';
	import CheckBox from '$lib/components/CheckBox.svelte';

	const addArbitrumGoerli = async () => {
		const client = await getWalletClient();
		if (!client) {
			toast.push('Connect MetaMask First', {
				classes: ['info']
			});
			return;
		}

		client?.addChain({ chain: arbitrumGoerli });
	};

	$: onboardingCompleted =
		$account.chainId === arbitrumGoerli.id && $account.balance > 0 && $userUsdc.balance > 0;

	/**
	 * @param {string} elementId
	 */
	function scrollTo(elementId) {
		const element = document.getElementById(elementId);
		if (!element) return;
		window.scrollTo({
			top: element.offsetTop,
			behavior: 'smooth'
		});
	}
</script>

<!-- Home and Onboarding -->

<div class="bg-gradient-to-br from-valhalla-600">
	<div class="relative isolate px-6 pt-14 lg:px-8">
		<div
			class="fixed inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
			aria-hidden="true"
		>
			<div
				class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-400 to-valhalla-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			/>
		</div>
		<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
			<div class="text-center">
				<h1 class="text-4xl font-bold tracking-tight dark:text-slate-100 sm:text-6xl">
					Hyperbolic Finance
				</h1>
				<p class="mt-6 text-lg leading-8 dark:text-slate-400">
					Redefining the Future of Crypto Derivatives
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6">
					{#if onboardingCompleted}
						<a
							href="/trading"
							class="rounded-md dark:bg-cyan-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
							>Start Trading</a
						>
					{:else}
						<button
							on:click={() => scrollTo('anchor-onboarding')}
							class="rounded-md dark:bg-cyan-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
						>
							Start Onboard
						</button>
					{/if}
					<button
						on:click={() => scrollTo('anchor-learn-more')}
						class="text-sm font-semibold leading-6 dark:text-slate-100"
					>
						Learn more
						<span aria-hidden="true">→</span></button
					>
				</div>
			</div>
		</div>
		<div
			class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
			aria-hidden="true"
		>
			<div
				class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-400 to-valhalla-400 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			/>
		</div>
	</div>
</div>

<div class="bg-gradient-to-tr from-primary-900 py-24 sm:py-32" id="anchor-learn-more">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:text-center">
			<h2 class="text-base font-semibold leading-7 text-cyan-200">Trade capital efficient</h2>
			<p class="mt-2 text-3xl font-bold tracking-tight text-white/85 sm:text-4xl">
				Smart Derivatives: The Future of Trading
			</p>
			<p class="mt-6 text-lg leading-8 dark:text-white/70">
				After a year of in-depth analysis and strategic planning, we introduce Smart Derivatives.
				Tailored to the blockchain. Unbeatable in terms of cost. Engineered with mechanisms to
				ensure protocol health. Adjustable and scalable.
			</p>
		</div>
		<div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
			<dl
				class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
			>
				<div class="relative pl-16">
					<dt class="text-base font-semibold leading-7 text-white/85">
						<div
							class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-700"
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
						</div>
						Revolutionary Blockchain Derivatives
					</dt>
					<dd class="mt-2 text-base leading-7 dark:text-white/70">
						We've decentralized derivatives and cut out the middleman, passing the savings directly
						to you. This isn't just a market opportunity—it's the future of trading.
					</dd>
				</div>
				<div class="relative pl-16">
					<dt class="text-base font-semibold leading-7 text-white/85">
						<div
							class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-700"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
								/>
							</svg>
						</div>
						Cost-Efficient
					</dt>
					<dd class="mt-2 text-base leading-7 dark:text-white/70">
						By eliminating liquidity providers, we've managed to reduce margin trading fees by up to
						90%. Experience the cost-effective solution for traders of all levels.
					</dd>
				</div>
				<div class="relative pl-16">
					<dt class="text-base font-semibold leading-7 text-white/85">
						<div
							class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-700"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
								/>
							</svg>
						</div>
						User-Friendly Interface
					</dt>
					<dd class="mt-2 text-base leading-7 dark:text-white/70">
						Hyperbolic Finance is designed with user experience in mind. Buy tokens for long or
						short positions with ease, without worrying about complexities.
					</dd>
				</div>
				<div class="relative pl-16">
					<dt class="text-base font-semibold leading-7 text-white/85">
						<div
							class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-700"
						>
							<svg
								class="h-6 w-6 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
								/>
							</svg>
						</div>
						Secure and Resilient Protocol
					</dt>
					<dd class="mt-2 text-base leading-7 dark:text-white/70">
						Our protocol is designed to prioritize security and health, ensuring a safe environment
						for your trades. Unlike traditional systems, we eliminate clearing house risk, providing
						a more resilient and reliable trading experience.
					</dd>
				</div>
			</dl>
		</div>
	</div>
</div>

<div class="bg-gradient-to-br from-valhalla-600" id="anchor-onboarding">
	<div class="relative isolate px-6 pt-14 lg:px-8">
		<div
			class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
			aria-hidden="true"
		>
			<div
				class="relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[-30deg] bg-gradient-to-tr from-primary-400 to-valhalla-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			/>
		</div>
		<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
			<div class="text-center">
				<h1 class="text-4xl font-bold tracking-tight dark:text-slate-100 sm:text-6xl">
					Onboarding
				</h1>
				<p class="mt-6 text-lg leading-8 dark:text-slate-400">
					Our Plattform is live for test users. Follow these simple steps to get started.
				</p>
			</div>
			<div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
				<dl
					class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-1 lg:gap-y-16"
				>
					<div class="relative pl-16">
						<dt class="text-base font-semibold leading-7 text-white/85">
							<CheckBox text="1." showCheckbox={$account.isConnected} />
							Connect MetaMask.
						</dt>
						<dd class="mt-2 text-base leading-7 dark:text-white/70">
							As this is a MVP, only MetaMask is supported. Please connect MetaMask
						</dd>
						<dd class="mt-2 text-base leading-7 dark:text-white/70">
							{#if $account.isConnected}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6 inline"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
								</svg>

								Perfect, you are already connected with MetaMask!
							{:else}
								<button
									on:click={connectWallet}
									class="text-sm font-semibold leading-6 dark:text-slate-100"
								>
									Connect MetaMask
								</button>
							{/if}
						</dd>
					</div>

					<div class="relative pl-16">
						<dt class="text-base font-semibold leading-7 text-white/85">
							<CheckBox text="2." showCheckbox={$account.chainId === arbitrumGoerli.id} />
							Add Arbitrum Testnet to your Wallet.
						</dt>
						<dd class="mt-2 text-base leading-7 dark:text-white/70">
							We currently support the Arbitrum Testnet. Add it to your wallet to get started.
						</dd>

						<dd class="mt-2 text-base leading-7 dark:text-white/70">
							{#if $account.chainId === arbitrumGoerli.id}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6 inline"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
								</svg>

								Perfect, you are already connected to Arbitrum Goerli
							{:else}
								<button
									on:click={addArbitrumGoerli}
									class="text-sm font-semibold leading-6 dark:text-slate-100"
								>
									Add Arbitrum Testnet
								</button>
							{/if}
						</dd>
					</div>

					<div class="relative pl-16">
						<dt class="text-base font-semibold leading-7 text-white/85">
							<CheckBox text="3." showCheckbox={$account.balance > 0} />
							Get Testnet Ether
						</dt>
						<dd class="mt-2 text-base leading-7 dark:text-white/70">
							To pay for you gas, you need testnet ether. We recommend this faucet, where you get it
							free and fast.
						</dd>
						<dd class="mt-2 text-base leading-7 dark:text-white/70">
							{#if $account.balance > 0}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6 inline"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
								</svg>

								Perfect, you are already have testnet ether on Arbitrum Goerli.
							{:else}
								<a
									href="https://faucet.triangleplatform.com/arbitrum/goerli"
									target="_blank"
									class="text-sm font-semibold leading-6 dark:text-slate-100"
								>
									Get Testnet Ether
								</a>
								(and reload this page afterwards)
							{/if}
						</dd>
					</div>

					<div class="relative pl-16">
						<dt class="text-base font-semibold leading-7 text-white/85">
							<CheckBox text="4." showCheckbox={$userUsdc.balance > 0} />
							Get some test USDC
						</dt>
						<dd class="mt-2 text-base leading-7 dark:text-white/70">
							To test our plattform we created a test smart contract of USDC. You can get it for
							free.
						</dd>
						<dd class="mt-2 text-base leading-7 dark:text-white/70">
							{#if $userUsdc.balance > 0}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6 inline"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
								</svg>

								You have enough test USDC to start trading.
							{:else}
								<button
									on:click={requestFunds}
									class="text-sm font-semibold leading-6 dark:text-slate-100"
								>
									Request Test USDC
								</button>
							{/if}
						</dd>
					</div>

					<div class="relative pl-16">
						<dt class="text-base font-semibold leading-7 text-white/85">
							<CheckBox text="5." showCheckbox={onboardingCompleted} />
							Have fun on our Plattform
						</dt>
						<dd class="mt-2 text-base leading-7 dark:text-white/70">
							To pay for you gas, you need testnet ether. We recommend this faucet, where you get it
							free and fast.
						</dd>
						<dd class="mt-2 text-base leading-7 dark:text-white/70">
							{#if onboardingCompleted}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6 inline"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
								</svg>

								Have fun testing our plattform!

								<a href="/trading" class="text-sm font-semibold leading-6 dark:text-slate-100">
									Go to Trading Page
								</a>
							{:else}
								Please complete the steps above first.
							{/if}
						</dd>
					</div>
				</dl>
			</div>
		</div>
		<div
			class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
			aria-hidden="true"
		>
			<div
				class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-400 to-valhalla-400 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			/>
		</div>
	</div>
</div>
