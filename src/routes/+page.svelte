<script>
	import HouseKeepingButton from '$lib/components/HouseKeepingButton.svelte';
	import OpenPositionForm from '$lib/components/OpenPositionForm.svelte';
	import PositionList from '$lib/components/PositionList.svelte';
	import TradingViewWidget from '$lib/components/TradingViewWidget.svelte';
	import PositionBalance from '$lib/components/PositionBalance.svelte';
	import WalletConnectButton from '$lib/components/WalletConnectButton.svelte';
</script>

<div class="lg:flex">
	<div class="flex-1 lg:flex">
		<HouseKeepingButton />
	</div>
</div>

<div class="lg:flex">
	<div class="basis-2/3 xl:basis-3/4">
		<div class="box">
			<TradingViewWidget />
			<PositionBalance />
		</div>
	</div>
	<div class="basis-1/3 xl:basis-1/4">
		<OpenPositionForm />
	</div>
</div>

<div class="lg:flex">
	<div class="basis-2/3 xl:basis-3/4" />
</div>

<div class="lg:flex">
	<div class="basis-2/3 xl:basis-3/4">
		<PositionList />
	</div>
</div>
