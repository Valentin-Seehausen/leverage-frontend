<script>
	import { getWalletClient } from '@wagmi/core';
	import { account, connectWallet } from '$lib/stores/wallet';
	import { arbitrumGoerli } from 'viem/chains';
	import { toast } from '@zerodevx/svelte-toast';
	import { addUsdcToWallet, userUsdc } from '$lib/stores/usdc';
	import { minBalance, minCollateral, usdcDecimals } from '$lib/config/constants';
	import GlowingBackground from '$lib/components/GlowingBackground.svelte';
	import { formatEther } from 'viem';
	import { formatValue } from '$lib/utils/format';
	import { client } from '$lib/stores/client';

	const addArbitrumGoerli = async () => {
		const client = await getWalletClient();
		if (!client) {
			toast.push('Connect MetaMask First', {
				classes: ['info']
			});
			return;
		}

		requestedNetworkChangeBefore = true;

		await client?.addChain({ chain: arbitrumGoerli });

		// Add an artificial delay to give user time to understand what is happeneing
		if (requestedFundsBefore && !requestingFunds) {
			console.log('simulate requsting funds');
			requestingFunds = true;
			simulateInsufficientBalance = true;
			setTimeout(() => {
				console.log('simulate requsting funds end');
				requestingFunds = false;
				simulateInsufficientBalance = false;
			}, 2000);
		}
	};

	let requestedFundsBefore = false;
	let requestingFunds = false;
	let requestedNetworkChangeBefore = false;
	let requestError = '';

	$: balance = $account.balance;
	let requestingAccountBalance = false;
	let simulateInsufficientBalance = false;

	const requestFunds = async () => {
		if (requestedFundsBefore) return;
		requestedFundsBefore = true;
		requestingFunds = true;

		console.time('request');

		const response = await fetch('/onboarding', {
			method: 'POST',
			body: JSON.stringify({ user: $account.address }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const { error } = await response.json();
		requestingFunds = false;

		if (error) {
			requestError = error;
			return;
		}

		console.timeEnd('request');

		userUsdc.requestUpdate();

		if ($account.address) {
			requestingAccountBalance = true;
			balance = 0n;
			client.publicClient.getBalance({ address: $account.address }).then((balanceResult) => {
				balance = balanceResult;
				requestingAccountBalance = false;
			});
		}
	};

	$: fetchingBalances =
		$account.fetchingBalance || $userUsdc.fetchingBalance || requestingAccountBalance;
	$: balancesSuffice =
		balance >= minBalance && $userUsdc.balance >= minCollateral && !simulateInsufficientBalance;
	// TODO: Fix this
	// $: $account.isConnected && !fetchingBalances && !balancesSuffice && requestFunds();
	$: $account.isConnected && requestFunds();

	/**
	 * @type {HTMLDivElement}
	 */
	let screen;
	let screenHeight = 0;
	$: screenHeight, screen?.scrollIntoView({ behavior: 'smooth', block: 'end' });
</script>

<div
	bind:this={screen}
	bind:clientHeight={screenHeight}
	class="min-h-screen flex flex-col justify-center items-center content-center gap-6 px-6 pt-[30vh] pb-[40vh] text-center"
>
	<div class="text-free-glow text-lg font-semibold">Ready for takeoff 🚀</div>
	<div class="info-label">Let's kick things off by connecting your MetaMask:</div>

	{#if !$account.isConnected}
		<div class="self-center my-3">
			<GlowingBackground>
				<button
					on:click={connectWallet}
					class="bg-gradient-to-br from-secondary-800 to-secondary-900 hover:from-secondary-700
    hover:to-secondary-800 py-3 ring-0 outline-none dark:text-secondary-50 font-medium
    shadow-[inset_0_12px_12px_0_rgb(0,0,0,0.05)] shadow-secondary-700/5 hover:shadow-secondary-700/10
    text-sm transition-all px-9 rounded-xl"
				>
					Connect MetaMask
				</button>
			</GlowingBackground>
		</div>
		<!-- {#if !$account.isConnected} -->
	{:else}
		<div>
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
			Your MetaMask is ready to roll! 🎉
		</div>

		<div class="info-label">Let's make sure your MetaMask is on the right network...🔗</div>

		{#if $account.chainId != arbitrumGoerli.id}
			Oops! You're not connected to Arbitrum Goerli Testnet. Let's switch lanes.
			<div class="self-center my-3">
				<GlowingBackground>
					<button
						on:click={addArbitrumGoerli}
						class="bg-gradient-to-br from-secondary-800 to-secondary-900 hover:from-secondary-700
		hover:to-secondary-800 py-3 ring-0 outline-none dark:text-secondary-50 font-medium
		shadow-[inset_0_12px_12px_0_rgb(0,0,0,0.05)] shadow-secondary-700/5 hover:shadow-secondary-700/10
		text-sm transition-all px-9 rounded-xl"
					>
						Switch to Arbitrum Goerli Testnet
					</button>
				</GlowingBackground>
			</div>

			<!-- {#if $account.chainId != arbitrumGoerli.id} -->
		{:else}
			{#if requestedNetworkChangeBefore}
				<div class="info-label">
					Oops! You're not connected to Arbitrum Goerli Testnet. Let's switch lanes.
				</div>
			{/if}
			<div>
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
				Awesome! You're {#if requestedNetworkChangeBefore}now {/if} connected to the Arbitrum Goerli
				Testnet.
			</div>

			{#if requestedFundsBefore && !requestingFunds}
				<div class="info-label">Let's take a quick peek at your balance...</div>
				<div class="info-label">
					Hmm, seems like your balance is a bit light, let's get that sorted.
				</div>
				<div class="info-label">Transferring you some Testnet Ether and Test USDC now...</div>
				{#if requestError != ''}
					<div class="info-label md:text-center">
						Oops, something didn't quite work out. Could you please inform our support team about
						this? Just a friendly reminder, fund requests are only possible every 3 hours.
					</div>
					<div class="dark:text-red-400 md:text-center">{requestError}</div>
				{:else}
					<div class="">
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
						💸 Voila! You've received some funds to jumpstart your journey!
					</div>
				{/if}
			{/if}

			{#if fetchingBalances && requestError == ''}
				{#if requestedFundsBefore}
					<div class="info-label animate-pulse">Checking your balance one more time...</div>
				{:else}
					<div class="info-label animate-pulse">Let's take a quick peek at your balance...</div>
				{/if}

				<!-- $account.fetchingBalance -->
			{:else if requestError == ''}
				{#if requestedFundsBefore}
					<div class="info-label">Checking your balance one more time...</div>
				{:else}
					<div class="info-label">Let's take a quick peek at your balance...</div>
				{/if}
				{#if !balancesSuffice}
					{#if requestedFundsBefore}
						{#if requestingFunds}
							<div class="info-label">
								Hmm, seems like your balance is a bit light, let's get that sorted.
							</div>
							<div class="animate-pulse">
								Transferring you some Testnet Ether and Test USDC now...
							</div>
						{:else}
							<div class="dark:text-red-400">
								Hmm, this is puzzling. We dispatched some balance to you, but it's not reflecting in
								our system. Please bring this to our team's attention.
							</div>
						{/if}
					{/if}
				{:else}
					<div>
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
						Perfect! You're all set with {formatEther(balance)} ETH and {formatValue(
							$userUsdc.balance,
							usdcDecimals,
							0
						)} of our TestUSDC.
					</div>

					<div>
						Want to <span
							class="cursor-pointer underline text-free-glow"
							on:click={addUsdcToWallet}
							on:keydown={addUsdcToWallet}>add our TestUSDC to your MetaMask wallet</span
						>? It's optional but handy.
					</div>

					<div class="info-label">...and now, the moment you've been waiting for:</div>

					<div class="mt-14 self-center my-3">
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
					</div>
					<!-- {#if !balancesSuffice} -->
				{/if}
				<!-- $account.fetchingBalance -->
			{/if}
			<!-- {#if $account.chainId != arbitrumGoerli.id} -->
		{/if}
		<!-- {#if !$account.isConnected} -->
	{/if}
</div>
