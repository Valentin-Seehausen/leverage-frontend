<script>
	import { account } from '$lib/stores/wallet';
	import { arbitrumGoerli } from 'viem/chains';
	import { userUsdc } from '$lib/stores/usdc';
	import { minCollateral } from '$lib/config/constants';
	import GlowingBackground from '$lib/components/GlowingBackground.svelte';

	$: onboardingCompleted =
		$account.chainId === arbitrumGoerli.id &&
		$account.balance > 0 &&
		$userUsdc.balance > minCollateral;

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

<div class="bg-gradient-to-br from-valhalla-600 relative">
	<div
		class="mx-auto max-w-2xl content-section px-3 sm:px-6 lg:px-8 py-48 sm:py-48 md:py-[30vh] lg:py-[30vh]"
	>
		<div class="text-center">
			<h1 class="text-4xl font-bold tracking-tight dark:text-slate-100 sm:text-6xl">
				Hyperbolic Finance 🚀
			</h1>
			<p class="mt-6 text-lg leading-8 dark:text-slate-400">
				Leading the Future with Smart Derivatives
			</p>
			<p class="mt-6 leading-8 dark:text-slate-400">
				We're leading the way in the crypto realm with advanced mathematics, introducing new
				possibilities for trading. Curious about getting on board? It's a breeze with our AI-like
				onboarding.
			</p>
			<div
				class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 flex-wrap gap-y-12"
			>
				{#if onboardingCompleted}
					<GlowingBackground>
						<a
							href="/trading"
							class="bg-gradient-to-br from-secondary-800 to-secondary-900 hover:from-secondary-700
		hover:to-secondary-800 py-3 ring-0 outline-none dark:text-secondary-50 font-medium
		shadow-[inset_0_12px_12px_0_rgb(0,0,0,0.05)] shadow-secondary-700/5 hover:shadow-secondary-700/10
		text-sm transition-all px-9 rounded-xl"
						>
							Trade Now 🚀
						</a>
					</GlowingBackground>
				{:else}
					<GlowingBackground>
						<a href="/onboarding" class="primary-button">⚡️ Onboard Me in a Minute</a>
					</GlowingBackground>
				{/if}
				<button
					on:click={() => scrollTo('anchor-learn-more')}
					class="text-sm font-semibold leading-6 dark:text-slate-100"
				>
					📚 Learn More]
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

<div class="bg-gradient-to-tr from-primary-900 py-24 sm:py-32" id="anchor-learn-more">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:text-center">
			<h2 class="text-base font-semibold leading-7 text-cyan-200/50">The New Era of Trading</h2>
			<p class="mt-2 text-3xl font-bold tracking-tight text-white/85 sm:text-4xl">
				Smart Derivatives - Capitalizing on Efficiency
			</p>
			<p class="mt-6 text-lg leading-8 dark:text-white/70">
				Following an intensive year of rigorous research and strategic development, we're thrilled
				to unveil Smart Derivatives, the new epoch in blockchain trading. Exquisitely crafted for
				the blockchain landscape, it excels in cost-effectiveness, underpinned by robust mechanisms
				that underscore the importance of protocol health. This is more than just trading—it's a
				flexible, scalable solution that catapults trading into a revolutionized future.
			</p>
		</div>
		<div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
			<dl
				class="grid max-w-xl grid-cols-1 gap-x-4 md:gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
			>
				<div class="relative pl-14 sm:pl-16">
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
						The Future is Decentralized
					</dt>
					<dd class="mt-2 text-base leading-7 dark:text-white/70">
						In our world, derivatives are decentralized and the middleman obsolete. We pass the
						savings directly to you, turning a market opportunity into a trading revolution.
					</dd>
				</div>
				<div class="relative pl-14 sm:pl-16">
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
						Hyper-Efficient Trading
					</dt>
					<dd class="mt-2 text-base leading-7 dark:text-white/70">
						We've shattered the cost barriers of trading by eliminating liquidity providers,
						reducing margin trading fees by up to 90%. Experience unparalleled efficiency that's
						accessible to traders of all levels.
					</dd>
				</div>
				<div class="relative pl-14 sm:pl-16">
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
						User-Centric Design
					</dt>
					<dd class="mt-2 text-base leading-7 dark:text-white/70">
						Navigating the world of trading has never been easier with Hyperbolic Finance. Our
						user-friendly interface allows you to buy tokens for long or short positions without the
						usual complexities.
					</dd>
				</div>
				<div class="relative pl-14 sm:pl-16">
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
						Security First, Resilience Always
					</dt>
					<dd class="mt-2 text-base leading-7 dark:text-white/70">
						Our protocol is designed with a laser focus on security and resilience, ensuring a safe
						environment for your trades. We've left the traditional clearing house risk behind,
						offering you a more reliable trading experience.
					</dd>
				</div>
				<div class="relative pl-14 sm:pl-16">
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
									d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
								/>
							</svg>
						</div>
						Fueling Efficiency
					</dt>
					<dd class="mt-2 text-base leading-7 dark:text-white/70">
						Our smart contracts are more than just complex math and simple code – they're a
						testament to optimal functionality. With our gas-efficient approach, you only pay the
						bare minimum for every transaction.
					</dd>
				</div>
				<div class="relative pl-14 sm:pl-16">
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
									d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
								/>
							</svg>
						</div>
						Pushing the Boundaries of Liquidation
					</dt>
					<dd class="mt-2 text-base leading-7 dark:text-white/70">
						Say goodbye to unnecessary fees that deplete your margins. With us, positions can stay
						open to their maximum potential, offering you the best attainable liquidation price
						across all protocols.
					</dd>
				</div>
			</dl>
		</div>
	</div>
</div>

<div class="bg-gradient-to-br from-valhalla-600">
	<div class="relative isolate px-3 md:px-6 pt-14 lg:px-8">
		<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
			<div class="text-center">
				<h1 class="text-4xl font-bold tracking-tight dark:text-slate-100 sm:text-6xl">
					Your Journey So Far 🛤️
				</h1>
				<p class="mt-6 text-lg leading-8 dark:text-slate-400">
					You're on an exciting path in the ever-evolving world of crypto. Here at Hyperbolic
					Finance, we value every step you've taken. Let's celebrate your achievements and continue
					to explore this revolutionary future together.
				</p>
				<p class="mt-6 text-lg leading-8 dark:text-slate-400">
					Let's revisit the milestones you've hit, and the heights we'll reach together. Ready for
					the next leg of the journey?
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6">
					{#if onboardingCompleted}
						<GlowingBackground>
							<a href="/trading" class="primary-button">Trade Now 🚀</a>
						</GlowingBackground>
					{:else}
						<GlowingBackground>
							<a href="/onboarding" class="primary-button">⚡️ Onboard Me in a Minute</a>
						</GlowingBackground>
					{/if}
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
