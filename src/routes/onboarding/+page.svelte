<script>
	import { getWalletClient } from '@wagmi/core';
	import { account, connectWallet } from '$lib/stores/wallet';
	import { arbitrumGoerli } from 'viem/chains';
	import { toast } from '@zerodevx/svelte-toast';
	import { addUsdcToWallet, increaseAllowance, userUsdc } from '$lib/stores/usdc';
	import { minBalance, minCollateral, usdcDecimals } from '$lib/config/constants';
	import GlowingBackground from '$lib/components/GlowingBackground.svelte';
	import { formatEther } from 'viem';
	import { formatValue } from '$lib/utils/format';
	import { client } from '$lib/stores/client';
	import { fade } from 'svelte/transition';

	// State

	let requestedFundsBefore = false;
	let requestingFunds = false;
	let requestedNetworkChangeBefore = false;
	let requestError = '';
	let requestedAllowanceBefore = false;
	let requestingAllowance = false;
	let skippedAllowance = false;

	$: balance = $account.balance;
	let requestingAccountBalance = false;
	let simulateInsufficientBalance = false;

	$: fetchingBalances =
		$account.fetchingBalance || $userUsdc.fetchingBalance || requestingAccountBalance;
	$: balancesSuffice =
		balance >= minBalance && $userUsdc.balance >= minCollateral && !simulateInsufficientBalance;
	$: $account.isConnected && !fetchingBalances && !balancesSuffice && requestFunds();

	/** @type {HTMLDivElement} */
	let screen;
	let screenHeight = 0;
	$: screenHeight, screen?.scrollIntoView({ behavior: 'smooth', block: 'end' });

	// Functions

	const addArbitrumGoerli = async () => {
		const walletclient = await getWalletClient();
		if (!walletclient) {
			toast.push('Connect MetaMask First', {
				classes: ['info']
			});
			return;
		}

		requestedNetworkChangeBefore = true;

		await walletclient?.addChain({ chain: arbitrumGoerli });

		// Add an artificial delay to give user time to understand what is happeneing
		if (requestedFundsBefore && !requestingFunds) {
			requestingFunds = true;
			simulateInsufficientBalance = true;
			setTimeout(() => {
				if ($account.address) {
					client.publicClient.getBalance({ address: $account.address }).then((balanceResult) => {
						balance = balanceResult;
						requestingAccountBalance = false;
						requestingFunds = false;
						simulateInsufficientBalance = false;
					});
				} else {
					requestingFunds = false;
					simulateInsufficientBalance = false;
				}
			}, 2000);
		}
	};

	const requestFunds = async () => {
		if (requestedFundsBefore) return;
		requestedFundsBefore = true;
		requestingFunds = true;

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

	const requestAllowance = () => {
		if (requestedAllowanceBefore) return;
		requestingAllowance = true;
		requestedAllowanceBefore = true;

		increaseAllowance(minCollateral * 1000n);
	};
</script>

<div
	bind:this={screen}
	bind:clientHeight={screenHeight}
	class="min-h-screen flex flex-col justify-center items-center content-center gap-6 px-6 pt-[30vh] pb-[40vh] text-center"
>
	<div class="text-free-glow text-lg font-semibold" in:fade|local>Ready for takeoff 🚀</div>
	<div class="info-label" in:fade|local>Let's kick things off by connecting your MetaMask:</div>

	{#if !$account.isConnected}
		<div class="self-center my-3">
			<GlowingBackground>
				<button on:click={connectWallet} class="primary-button"> Connect MetaMask </button>
			</GlowingBackground>
		</div>
		<!-- {#if !$account.isConnected} -->
	{:else}
		<div in:fade|local class="my-4 min-h-7">
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

		{#if $account.chainId != arbitrumGoerli.id}
			<div in:fade|local>Let's make sure your MetaMask is on the right network...🔗</div>
			<div class="self-center my-3" in:fade|local>
				<GlowingBackground>
					<button on:click={addArbitrumGoerli} class="primary-button">
						Switch to Arbitrum Goerli Testnet
					</button>
				</GlowingBackground>
			</div>

			<!-- {#if $account.chainId != arbitrumGoerli.id} -->
		{:else}
			{#if requestedNetworkChangeBefore}
				<div class="info-label">Let's make sure your MetaMask is on the right network...🔗</div>
			{/if}
			<div in:fade|local class="my-4 min-h-7">
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
				<div class="info-label">Transferring you some Testnet Ether and Test USDC now...</div>
				{#if requestError != ''}
					<div class="info-label md:text-center" in:fade|local>
						Oops, something didn't quite work out. Could you please inform our support team about
						this? Just a friendly reminder, fund requests are only possible every 3 hours.
					</div>
					<div class="dark:text-red-400 md:text-center">{requestError}</div>
				{/if}
			{/if}

			{#if fetchingBalances && requestError == ''}
				<!-- $account.fetchingBalance -->
			{:else if requestError == ''}
				{#if !balancesSuffice}
					{#if requestedFundsBefore}
						{#if requestingFunds}
							<div class="animate-pulse" in:fade|local>
								Transferring you some Testnet Ether and Test USDC now...
							</div>
						{:else}
							<div class="dark:text-red-400" in:fade|local>
								Hmm, this is puzzling. We dispatched some balance to you, but it's not reflecting in
								our system. Please bring this to our team's attention.
							</div>
						{/if}
					{/if}
				{:else}
					<div class="my-4 min-h-7" in:fade|local>
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
						💸 Voila! You're all set with {formatEther(balance)} ETH and {formatValue(
							$userUsdc.balance,
							usdcDecimals,
							0
						)} of our TestUSDC.
					</div>

					{#if $userUsdc.allowance == 0n && !skippedAllowance}
						<div class="info-label" in:fade|local>
							Last step! Approve our TestUSDC (or <span
								class="underline cursor-pointer text-free-glow"
								on:click={() => (skippedAllowance = true)}
								on:keydown={() => (skippedAllowance = true)}>skip</span
							>).
						</div>
						{#if !requestingAllowance && !requestedAllowanceBefore}
							<div class="self-center my-3" in:fade|local>
								<GlowingBackground>
									<button on:click={requestAllowance} class="primary-button">
										Approve TestUSDC
									</button>
								</GlowingBackground>
							</div>
						{:else}
							<div class="my-4 min-h-7 animate-pulse">
								Waiting for your first transaction to be mined... 🥳
							</div>
						{/if}
						<!-- {#if $userUsdc.allowance == 0n} -->
					{:else}
						<div class="info-label">Last step! Approve our TestUSDC (or skip).</div>
						{#if skippedAllowance}
							<div class="my-4 min-h-7">
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
								Ok! To it later.
							</div>
						{/if}
						{#if requestedAllowanceBefore}
							<div class="my-4 min-h-7 info-label">
								Waiting for your first transaction to be mined... 🥳
							</div>

							<div class="my-4 min-h-7">
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
								Very niiiice, you're all set!
							</div>
						{/if}

						<div class="mt-14 self-center my-3" in:fade|local>
							<GlowingBackground>
								<a href="/trading" class="primary-button"> Trade Now 🚀 </a>
							</GlowingBackground>
						</div>

						<div class="mt-12" in:fade|local>
							Optional but handy: <span
								class="cursor-pointer underline"
								on:click={addUsdcToWallet}
								on:keydown={addUsdcToWallet}>add our TestUSDC to your MetaMask wallet</span
							>
						</div>
						<!-- {#if $userUsdc.allowance == 0n} -->
					{/if}
					<!-- {#if !balancesSuffice} -->
				{/if}
				<!-- $account.fetchingBalance -->
			{/if}
			<!-- {#if $account.chainId != arbitrumGoerli.id} -->
		{/if}
		<!-- {#if !$account.isConnected} -->
	{/if}
</div>
