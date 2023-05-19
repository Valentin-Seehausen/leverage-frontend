const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');
const defaultColors = require('tailwindcss/colors');

const brandColors = {
	// The dark blue background color
	valhalla: {
		50: '#F4F4F7',
		100: '#EAE9EE',
		200: '#CAC7D5',
		300: '#AAA5BB',
		400: '#6B6288',
		500: '#2B1E55',
		600: '#271B4D',
		700: '#1A1233',
		800: '#130E26',
		900: '#0D091A'
	},
	// The red color
	mandy: {
		50: '#FFF7F8',
		100: '#FEF0F1',
		200: '#FDD9DC',
		300: '#FBC3C7',
		400: '#F8959D',
		500: '#F56873',
		600: '#DD5E68',
		700: '#933E45',
		800: '#6E2F34',
		900: '#4A1F23'
	},
	// Can also be used for green
	'bright-turquoise': {
		50: '#F3FEFD',
		100: '#E8FCFB',
		200: '#C5F9F4',
		300: '#A2F5EE',
		400: '#5DEDE1',
		500: '#17E5D4',
		600: '#15CEBF',
		700: '#0E897F',
		800: '#0A675F',
		900: '#074540'
	},
	// The purple color
	cosmic: {
		50: '#F9F5F7',
		100: '#F2EBEF',
		200: '#DFCCD6',
		300: '#CBAEBE',
		400: '#A4718D',
		500: '#7D345C',
		600: '#712F53',
		700: '#4B1F37',
		800: '#381729',
		900: '#26101C'
	},

	// The yellow to orange color
	rajah: {
		50: '#fff8ed',
		100: '#feefd6',
		200: '#fddbab',
		300: '#fbbe72',
		400: '#f89a3f',
		500: '#f67e19',
		600: '#e7620f',
		700: '#bf4a0f',
		800: '#983b14',
		900: '#7b3313',
		950: '#421708'
	},
	// Green
	bilbao: {
		50: '#f0fdf0',
		100: '#dcfcde',
		200: '#bbf7bf',
		300: '#86ef8f',
		400: '#4ade57',
		500: '#22c530',
		600: '#16a323',
		700: '#157f1f',
		800: '#16651e',
		900: '#14531b',
		950: '#052e0b'
	},
	// Reg
	tamarillo: {
		50: '#fef2f3',
		100: '#ffe1e4',
		200: '#ffc9ce',
		300: '#fea3ab',
		400: '#fc6d7a',
		500: '#f43f4f',
		600: '#e12132',
		700: '#bd1827',
		800: '#931621',
		900: '#821a23',
		950: '#47080e'
	}
};

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			black: defaultColors.black,
			slate: defaultColors.slate,
			white: defaultColors.white,
			gray: defaultColors.slate,
			primary: brandColors.mandy,
			red: brandColors.tamarillo,
			cyan: brandColors['bright-turquoise'],
			secondary: brandColors['bright-turquoise'],
			green: brandColors.bilbao,
			valhalla: brandColors.valhalla,
			purple: brandColors.cosmic,
			yellow: brandColors.rajah,

			extend: {}
		},
		extend: {}
	},

	plugins: [forms, typography]
};

module.exports = config;
