import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import path from 'path';

const production = !process.env.ROLLUP_WATCH;

/**
 * 
 * @param { {
 * 	src: string,
 * 	outdir: string,
 * 	element?: boolean,
 * 	keepCss?: boolean
 * } } options 
 */
function build(options) {
	options = {
		element: false,
		keepCss: false,
		...options
	};

	const configs = {
		input: options.src, // 'src/main.ts',
		output: {
			sourcemap: false,
			format: 'iife',
			name: 'app',
			file: options.outdir // 'public/build/bundle.js'
		},
		plugins: [
			svelte({
				preprocess: sveltePreprocess({ sourceMap: !production }),
				compilerOptions: {
					dev: !production,
					customElement: options.element,
				}
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production
			}),
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	};

	return configs;
}

function buildElements() {
	const dir = path.join(__dirname, 'src', 'elements');
	const outDir = `.build/build/elements/`;
	return fs
		.readdirSync(dir)
		.map(f => {
			const name = f.replace(".wc.svelte", "").toLocaleLowerCase();
			return build({
				src: `src/elements/${f}/index.ts`,
				outdir: outDir + `${name}.wc.js`,
				element: true,
				keepCss: true
			});
		});
}



export default buildElements();