import preprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		// Following is copied from https://github.com/sveltejs/kit/issues/8650
		typescript: {
			config: (tsconfig) => {
				const {
					// destructure properties we don't want
					// eslint-disable-next-line no-unused-vars
					importsNotUsedAsValues: _,
					// eslint-disable-next-line no-unused-vars
					preserveValueImports: __,
					// keep the rest in a single object
					...compilerOptions
				} = tsconfig.compilerOptions;

				return {
					...tsconfig,
					compilerOptions: {
						...compilerOptions
					}
				};
			}
		}
	},
	preprocess: [
		vitePreprocess(),
		preprocess({
			postcss: true
		})
	]
};

export default config;
