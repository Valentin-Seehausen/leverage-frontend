<script>
	import OpenPositionForm from './components/OpenPositionForm.svelte';
	import PositionList from './components/PositionList.svelte';
	import TradingViewWidget from './components/TradingViewWidget.svelte';
</script>

<h1 class="text-3xl font-bold m-6">Welcome to P2P Leverage</h1>
<div class="">
	<TradingViewWidget />
	<OpenPositionForm />
	<PositionList />
</div>
