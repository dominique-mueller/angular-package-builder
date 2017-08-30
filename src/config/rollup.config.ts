import { Options, Bundle, Warning, Plugin, WriteOptions } from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';

// Similar to 'RollupWriteOptions' but with the latest definitions (no deprecated options)
export interface RollupWriteOptions {
	banner?: WriteOptions[ 'banner' ];
	exports?: WriteOptions[ 'exports' ];
	file: WriteOptions[ 'dest' ]; // Previously 'dest'
	footer?: WriteOptions[ 'footer' ];
	format?: WriteOptions[ 'format' ];
	globals?: WriteOptions[ 'globals' ];
	indent?: WriteOptions[ 'indent' ];
	interop?: WriteOptions[ 'interop' ];
	intro?: WriteOptions[ 'intro' ];
	moduleId?: WriteOptions[ 'moduleId' ];
	moduleName?: WriteOptions[ 'moduleName' ];
	outro?: WriteOptions[ 'outro' ];
	sourcemap?: WriteOptions[ 'sourceMap' ]; // Previously 'sourceMap'
	sourceMapFile?: WriteOptions[ 'sourceMapFile' ];
	useStrict?: WriteOptions[ 'useStrict' ];
}

export function getRollupOutputConfig(): RollupWriteOptions {

	return {

		exports: 'named', // We export multiple things
		file: 'dist-temp/library-bundles/bundle.js',
		sourcemap: true,
		format: 'es',

		// moduleId: '',
		// moduleName: 'angular-notifier',

		globals: { // TODO: Dynamic
			'@angular/core': 'angular.core',
			'@angular/common': 'angular.common',
			'rxjs/Subject': 'Rx'
		},
		// indent: '	'


		// moduleId: '',
		// name: `${opts.moduleName}`,
		// file: opts.dest,
		// format: opts.format,
		// banner: '',
		// globals: globals,
		// sourcemap: true

	};

}

// Similar to 'Options' but with the latest definitions (no deprecated options)
export interface RollupOptions {
	acorn?: Options[ 'acorn' ];
	cache?: Options[ 'cache' ];
	context?: Options[ 'context' ];
	external?: Options[ 'external' ];
	input: Options[ 'entry' ]; // Previously 'entry'
	legacy?: Options[ 'legacy' ];
	moduleContext?: Options[ 'moduleContext' ];
	onwarn?: Options[ 'onwarn' ];
	paths?: Options[ 'paths' ];
	plugins?: Options[ 'plugins' ];
	treeshake?: Options[ 'treeshake' ];
}

export function getRollupInputConfig(): RollupOptions {

	return {
		input: 'dist-temp/library-es2015/angular-notifier.js', // Previously 'entry' which is now deprecated
		external: [ // TODO: Dynamic
			'@angular/core',
			'@angular/common',
			'rxjs/Subject'
		],
		plugins: [
			nodeResolve( {
				module: true
			} ),
		],
		// onwarn: ( warning ) => {

		// 	// Ignore warnings for external dependencies, such as Angular or RxJS
		// 	if ( warning.message.indexOf( 'treating it as an external dependency' ) > -1 ) {
		// 		return;
		// 	}

		// 	// For everything else, log a warning
		// 	console.warn( warning.message );

		// }

		// if (warning.code === 'THIS_IS_UNDEFINED') {
		// 	return;
		//   }

		//   console.warn(warning.message);

	};

}

