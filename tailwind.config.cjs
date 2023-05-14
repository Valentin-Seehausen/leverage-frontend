const daisyui = require('daisyui');
const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
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

	plugins: [forms, typography, daisyui]
};

module.exports = config;
