<script>
	let longPositions = 65;
	let shortPositions = 135;

	$: longPositionsPercentage = (longPositions / (longPositions + shortPositions)) * 100;
	$: shortPositionsPercentage = (shortPositions / (longPositions + shortPositions)) * 100;
</script>

<div class="p-6">
	<h2 class="font-semibold font-heading mb-2">Position Balance</h2>
	<div class="relative bg-gray-200 rounded h-8">
		<div
			class="absolute left-0 h-full bg-green-600 text-white text-xs text-center leading-8 px-2"
			style={`width: ${longPositionsPercentage}%`}
		>
			LONG: {longPositionsPercentage}% ({longPositions}k)
		</div>
		<div
			class="absolute right-0 h-full bg-red-600 text-white text-xs text-center leading-8 px-2"
			style={`width: ${shortPositionsPercentage}%`}
		>
			SHORT: {shortPositionsPercentage}% ({shortPositions}k)
		</div>
	</div>
</div>
