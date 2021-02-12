import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import pkg from './package.json';
import fs from 'fs-extra';

const production = !process.env.ROLLUP_WATCH;


function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

const crossPlatformPlugin = (production, type) => ({
	name: "remove-dev-code",
	transform: (code,id) => {
		if (production) {
			code = code.replace(/\/\/IFDEV[\w\W]+?\/\/END/g, "");
		}

		if (type!==""){
			code = code.replace("~~~platform~~~",type);
			
			if (["electron","web","capacitor"].filter(v=>v!==type).find(v=>id.endsWith(v+"Adapter.ts"))){
				return "export default undefined;"
			}
		}

		return code;
	}
});

const copyHtml = (type) => {
	let copied = false;
	return {
		name: "copyHtml",

		'buildEnd': async () => {
			if (copied) {
				return
			}
			
			copied=true;

			const from = "./public/"
			const to = type + "/public/";
			await fs.copy(from, to);

		}
	}
}

const frontend = (type, last = false) => (

	{
		input: 'src/main.ts',
		output: {
			sourcemap: !production,
			format: 'iife',
			name: 'app',
			file: type + '/public/build/bundle.js'
		},
		plugins: [
			crossPlatformPlugin(production, type)
			, svelte({
				preprocess: sveltePreprocess({ sourceMap: !production }),
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production
				}
			}),
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css({ output: 'bundle.css' }),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production,
				stripInternal: false
			}),

			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && last && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			!production && livereload({ watch: ['public', type + '/public/build'] }),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(),

			// copy the html file and everything else from the public folder to the destination folder
			copyHtml(type)
		],
		watch: {
			clearScreen: false
		}
	}
);


export default [
	{
		input: 'src-electron/main.ts',
		output: {
			sourcemap: !production,
			format: 'cjs',
			name: 'electron',
			dir: 'electron'
		},
		external: [
			...Object.keys(pkg.devDependencies || {}),
			...Object.keys(pkg.dependencies || {}),
			...Object.keys(pkg.peerDependencies || {})
		],
		plugins: [
			crossPlatformPlugin(production, "")
			,
			typescript({
				sourceMap: !production,
				inlineSources: !production
			}),
		]
	},
	frontend("capacitor"),
	frontend("electron"),
	frontend("web", true),
];

