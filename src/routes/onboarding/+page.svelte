<script>
	import { fetchBalance, getWalletClient } from '@wagmi/core';
	import { account, connectWallet } from '$lib/stores/wallet';
	import { arbitrumGoerli } from 'viem/chains';
	import { toast } from '@zerodevx/svelte-toast';
	import { addUsdcToWallet, userUsdc } from '$lib/stores/usdc';
	import { minBalance, minCollateral, usdcDecimals } from '$lib/config/constants';
	import GlowingBackground from '$lib/components/GlowingBackground.svelte';
	import { formatEther } from 'viem';
	import { formatValue } from '$lib/utils/format';

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

	let requestedFundsBefore = false;
	let requestingFunds = false;
	let requestError = '';

	$: balance = $account.balance;

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
		}

		userUsdc.requestUpdate();

		if ($account.address) {
			balance = 0n;
			fetchBalance({ address: $account.address }).then((balanceResult) => {
				balance = balanceResult.value;
			});
		}
	};

	$: fetchingBalances = $account.fetchingBalance || $userUsdc.fetchingBalance;
	$: balancesSuffice = balance >= minBalance && $userUsdc.balance >= minCollateral;
	$: $account.isConnected && !fetchingBalances && !balancesSuffice && requestFunds();

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
	<div class="text-free-glow text-lg font-semibold">Lets get you onboarded 🦾</div>
	<div class="info-label">First step is to connect your MetaMask:</div>

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
			Perfect, your MetaMask is connected.
		</div>

		<div class="info-label">Checking your network...</div>

		{#if $account.chainId != arbitrumGoerli.id}
			Not connected to Arbitrum Goerli Testnet. Please switch chain.
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
				Well done, you are connect to Arbitrum Goerli Testnet.
			</div>

			{#if requestedFundsBefore && !requestingFunds}
				<div class="info-label">Checking your balance...</div>
				<div class="info-label">Your balance does not suffice, let's get your sorted.</div>
				<div class="info-label">Sending you Testnet Ether and Test USDC</div>
				{#if requestError != ''}
					<div class="info-label md:text-center">
						Damn, there was an error. Please contact the team and tell them this (also please note
						that you can request funds only every 3 hours):
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
						You received some funds to get started!
					</div>
				{/if}
			{/if}

			{#if fetchingBalances && requestError == ''}
				<div class="info-label animate-pulse">Checking your balance...</div>

				<!-- $account.fetchingBalance -->
			{:else if requestError == ''}
				<div class="info-label">Checking your balance...</div>
				{#if !balancesSuffice}
					{#if requestedFundsBefore}
						{#if requestingFunds}
							<div class="info-label">Your balance does not suffice, let's get your sorted.</div>
							<div class="animate-pulse">Sending you Testnet Ether and Test USDC</div>
						{:else}
							<div class="dark:text-red-400">
								Weird. We sent you some balance but we cannot detect it... Please contact the team.
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
						You have a balance of {formatEther(balance)} ETH and {formatValue(
							$userUsdc.balance,
							usdcDecimals
						)} of our TestUSDC.
					</div>

					<div>
						You can optionally <span
							class="cursor-pointer underline text-free-glow"
							on:click={addUsdcToWallet}
							on:keydown={addUsdcToWallet}>add our TestUSDC to your MetaMask wallet</span
						>.
					</div>

					<div class="info-label">...and of course:</div>

					<div class="mt-14 self-center my-3">
						<GlowingBackground>
							<a
								href="/trading"
								class="bg-gradient-to-br from-secondary-800 to-secondary-900 hover:from-secondary-700
						hover:to-secondary-800 py-3 ring-0 outline-none dark:text-secondary-50 font-medium
						shadow-[inset_0_12px_12px_0_rgb(0,0,0,0.05)] shadow-secondary-700/5 hover:shadow-secondary-700/10
						text-sm transition-all px-9 rounded-xl"
							>
								Start Trading
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
