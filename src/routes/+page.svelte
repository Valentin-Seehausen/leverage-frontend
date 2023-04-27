<script>
	import HouseKeepingButton from './components/HouseKeepingButton.svelte';
	import OpenPositionForm from './components/OpenPositionForm.svelte';
	import PositionList from './components/PositionList.svelte';
	import TradingViewWidget from './components/TradingViewWidget.svelte';
</script>

<div class="lg:flex items-center m-6 mb-12">
	<h1 class="flex-1 justify-center text-3xl font-bold flex-2 mb-4 lg:mb-0 font-heading">
		Welcome to P2P Leverage
	</h1>
	<div class="flex-1 align-middle items-center justify-end lg:flex">
		<HouseKeepingButton />
	</div>
</div>

<div class="lg:flex">
	<div class="basis-2/3 xl:basis-3/4">
		<TradingViewWidget />
	</div>
	<div class="basis-1/3 xl:basis-1/4">
		<OpenPositionForm />
	</div>
</div>

<div class="lg:flex">
	<div class="basis-1/2">
		<PositionList />
	</div>
</div>
