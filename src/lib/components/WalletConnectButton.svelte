<script>
	import { wallet } from '$lib/stores/wallet';

	let toggleConnection = () => {
		if ($wallet.isConnected) {
			wallet.disconnect();
		} else {
			wallet.connect();
		}
	};
</script>

<button
	class="block md:inline font-bold w-full md:w-auto md:px-8 md:ml-4 px-3 py-2 bg-slate-700 text-slate-100 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
  invalid:border-pink-500 invalid:text-pink-600
  focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
	on:click={toggleConnection}
>
	{#if $wallet.isConnected}
		{$wallet.shortAddress}
	{:else}
		Connect Wallet
	{/if}
</button>
