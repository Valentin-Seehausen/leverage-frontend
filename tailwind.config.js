/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: [
				'Inter var, sans-serif',
				{
					fontFeatureSettings: '"ss01", "ss02", "ss03", "tnum", "case", "zero"',
					fontVariationSettings: '"opsz" 32'
				}
			]
		},
		extend: {}
	},
	plugins: []
};
