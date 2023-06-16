<script>
	import OpenPositionForm from '$lib/components/OpenPositionForm.svelte';
	import FeedbackForm from '$lib/components/FeedbackForm.svelte';
	import DevPanel from '$lib/components/DevPanel.svelte';
	import PositionList from '$lib/components/positions/PositionList.svelte';
	import TradingViewWidget from '$lib/components/TradingViewWidget.svelte';
	import PositionBalance from '$lib/components/positions/PositionBalance.svelte';
	import HouseKeepingButton from '$lib/components/HouseKeepingButton.svelte';
</script>

<div class="max-w-screen-2xl min-h-full m-auto xl:p-3 md:mt-24">
	<HouseKeepingButton />
	<div class="flex flex-wrap">
		<div class="basis-full lg:basis-2/3 xl:basis-3/4">
			<div class="box">
				<TradingViewWidget />
			</div>
			<PositionBalance />
			<PositionList />
		</div>
		<div class="basis-full lg:basis-1/3 xl:basis-1/4 order-first lg:order-last">
			<div class="lg:sticky top-32">
				<OpenPositionForm />
				<FeedbackForm />
				<DevPanel />
			</div>
		</div>
	</div>
</div>
