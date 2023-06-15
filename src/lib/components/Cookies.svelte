<script>
	let acceptedCookies = localStorage.getItem('acceptedCookies') === 'true';
	let sawCookieNotice = localStorage.getItem('sawCookieNotice') === 'true';
</script>

<svelte:head>
	{#if acceptedCookies}
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-FPV19HC5DE"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());

			gtag('config', 'G-FPV19HC5DE');
		</script>

		<script>
			(function (h, o, t, j, a, r) {
				h.hj =
					h.hj ||
					function () {
						(h.hj.q = h.hj.q || []).push(arguments);
					};
				h._hjSettings = { hjid: 3532797, hjsv: 6 };
				a = o.getElementsByTagName('head')[0];
				r = o.createElement('script');
				r.async = 1;
				r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
				a.appendChild(r);
			})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
		</script>
	{/if}
</svelte:head>

{#if !sawCookieNotice}
	<div class="fixed bottom-6 z-50 p-6 inset-x-0 mx-20">
		<div class="box">
			<div class="box-head">
				<h2>Cookie Policy</h2>
			</div>
			<div class="box-content">
				Hey, it would be awesome if you would help us with our user tests! We use cookies to ensure
				you get the best experience on our website. By using our website you agree to our{' '}
				<a href="/terms/privacy-policy">Privacy Policy</a>.
				<button
					class="user-button"
					on:click={() => {
						localStorage.setItem('acceptedCookies', 'false');
						localStorage.setItem('sawCookieNotice', 'true');
						sawCookieNotice = true;
						acceptedCookies = false;
					}}
				>
					No Cookies for me
				</button>
				<button
					class="primary-button rounded-md"
					on:click={() => {
						localStorage.setItem('acceptedCookies', 'true');
						localStorage.setItem('sawCookieNotice', 'true');
						sawCookieNotice = true;
						acceptedCookies = true;
					}}
				>
					Accept
				</button>
			</div>
		</div>
	</div>
{/if}
