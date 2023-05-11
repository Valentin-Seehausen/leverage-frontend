<script>
	import OpenPositionForm from '$lib/components/OpenPositionForm.svelte';
	import PositionList from '$lib/components/positions/PositionList.svelte';
	import TradingViewWidget from '$lib/components/TradingViewWidget.svelte';
	import PositionBalance from '$lib/components/positions/PositionBalance.svelte';
</script>

<div class="lg:flex">
	<div class="basis-2/3 xl:basis-3/4">
		<div class="box">
			<TradingViewWidget />
		</div>
		<div class="box">
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
