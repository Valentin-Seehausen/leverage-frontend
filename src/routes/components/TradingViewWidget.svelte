<script>
	const initTradingView = () => {
		console.log(123);
		// @ts-ignore
		new TradingView.widget({
			Autosize: true,
			symbol: 'BINANCE:BTCUSDC',
			interval: 'D',
			timezone: 'Etc/UTC',
			theme: 'light',
			style: '1',
			locale: 'en',
			toolbar_bg: '#f1f3f6',
			enable_publishing: false,
			allow_symbol_change: false,
			container_id: 'tradingview_fd9fe'
		});
	};
</script>

<svelte:head>
	<script
		type="text/javascript"
		src="https://s3.tradingview.com/tv.js"
		on:load={initTradingView}
	></script>
</svelte:head>

<div class="tradingview-widget-container block w-100 h-100">
	<div id="tradingview_fd9fe" />
	<div class="tradingview-widget-copyright">
		<a
			href="https://www.tradingview.com/symbols/BTCUSDC/?exchange=BINANCE"
			rel="noopener"
			target="_blank"><span class="blue-text">BTCUSDC chart</span></a
		> by TradingView
	</div>
</div>
