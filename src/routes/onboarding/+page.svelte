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
		$account.chainId === arbitrumGoerli.id &&
		$account.balance > 0 &&
		$userUsdc.balance > minCollateral;
</script>

<div class="h-screen flex flex-col justify-center items-center content-center gap-6">
	<div class="text-free-glow text-lg font-semibold">Lets get you onboarded 🦾</div>
	<div class="info-label">First step is to connect your MetaMask:</div>

	{#if !$account.isConnected}
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

			{#if $account.fetchingBalance && $userUsdc.fetchingBalance}
				<div class="info-label animate-pulse">Checking your balance...</div>
				<!-- $account.fetchingBalance -->
			{:else}
				<div class="info-label">Checking your balance...</div>
				{#if $account.balance >= minBalance && $userUsdc.balance >= minCollateral}
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
						You have a balance of {formatEther($account.balance)} ETH and {formatValue(
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

					<div class="mt-6">
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
					<!-- {#if $account.balance} -->
				{:else}
					<!-- {#if $account.balance} -->
				{/if}
				<!-- $account.fetchingBalance -->
			{/if}
			<!-- {#if $account.chainId != arbitrumGoerli.id} -->
		{/if}
		<!-- {#if !$account.isConnected} -->
	{/if}
</div>
