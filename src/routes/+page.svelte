<script>
	import OpenPositionForm from './components/OpenPositionForm.svelte';
</script>

<h1 class="text-3xl font-bold">Welcome to P2P Leverage</h1>

<div
	class="tradingview bg-gradient-to-r from-indigo-500 from-10% via-purple-500 via-30% to-pink-500 to-90%"
>
	Trading View
</div>

<OpenPositionForm />

<style>
	.tradingview {
		background-color: #1c3f72;
		color: #f7f7f7;
		padding: 30px;
		margin: auto;
		height: 200px;
	}
</style>
