<script>
	import '../app.css';
</script>

<nav class="flex place-content-between px-8 py-4">
	<a href="/">Trading</a>
	<a href="/wallet">Wallet</a>
	<a href="/liquidity-pool">Liquidity Pool</a>
</nav>

<div class="max-w-screen-2xl m-auto antialiased">
	<slot />
</div>
