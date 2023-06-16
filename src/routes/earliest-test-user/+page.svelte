<script>
	import GlowingBackground from '$lib/components/GlowingBackground.svelte';
</script>

<div class="bg-gradient-to-br from-valhalla-600 relative">
	<div
		class="mx-auto max-w-2xl content-section px-3 sm:px-6 lg:px-8 py-48 sm:py-48 md:py-[30vh] lg:py-[30vh]"
	>
		<div class="text-center">
			<h1 class="text-4xl font-bold tracking-tight dark:text-slate-100 sm:text-6xl">
				Join the first 100 users
			</h1>
			<p class="mt-6 text-lg leading-8 dark:text-slate-400">
				You will be rewarded with a Discord role "earliest test user (v0.3)" that will prove useful
				in the next years.
			</p>
			<p class="mt-6 text-lg leading-8 dark:text-slate-400">
				We reward you, because by providing early feedback, you help us improve our P2P trading
				paradigm.
			</p>
			<div class="mt-6 leading-8 dark:text-slate-400 prose">
				Here is what you have to do to earn your role:

				<div class="border-secondary-400 box bg-from-secondary-600 bg-to-secondary-800 px-6 py-3">
					<h3 class="font-semibold mb-4 text-xl">1. Explore Hyperbolic Finance</h3>
					<p>
						Open a few positions, understand how to make a profit. Compare the amplifier with
						traditional funding fees.
					</p>
				</div>
				<div class="border-secondary-400 box bg-from-secondary-600 bg-to-secondary-800 px-6 py-3">
					<h3 class="font-semibold mb-4 text-xl">2. Provide Feedback</h3>
					<p>
						Join our <a class="underline" href="https://discord.gg/5Yp7kjxaau" target="_blank"
							>Discord</a
						>. Write a short or long message in the feedback channel. Just say what you think and
						how you found your trading experience.
					</p>
				</div>
				<div class="border-secondary-400 box bg-from-secondary-600 bg-to-secondary-800 px-6 py-3">
					<h3 class="font-semibold mb-4 text-xl">3. Receive your reward</h3>
					<p>We will assign the Discord role automatically.</p>
				</div>
			</div>
			<p class="mt-6 text-lg leading-8 dark:text-slate-400">
				<strong>Please keep in mind:</strong> You are testing version v0.3. You can only open positions
				but not close. Choose a high leverage for a narrow liquidation and take-profit price, so you
				position gets closed automatically. In a few weeks, we will provide the close position functionality
				on v0.4.
			</p>
			<p class="mt-6 text-lg leading-8 dark:text-slate-400">
				We onboard the first frens and family users, as we want to build a small community for
				testing our version 0.4. The role "earliest test user (v0.3)" is only available now.
			</p>
			<p class="mt-6 text-lg leading-8 dark:text-slate-400">
				Perfect, your next step is to get onboarded:
			</p>
			<div
				class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 flex-wrap gap-y-12"
			>
				<GlowingBackground>
					<a href="/onboarding" class="primary-button">⚡️ Onboard Me in a Minute</a>
				</GlowingBackground>
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
