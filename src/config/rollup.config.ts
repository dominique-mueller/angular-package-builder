import { Options, Bundle, Warning, Plugin, WriteOptions } from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';

// Similar to 'RollupWriteOptions' but with the latest definitions (no deprecated options)
export interface RollupWriteOptions {
	file: WriteOptions[ 'dest' ]; // Previously 'dest'
	sourcemap?: WriteOptions[ 'sourceMap' ]; // Previously 'sourceMap'
	sourceMapFile?: WriteOptions[ 'sourceMapFile' ];
	format?: WriteOptions[ 'format' ];
	exports?: WriteOptions[ 'exports' ];
	moduleId?: WriteOptions[ 'moduleId' ];
	moduleName?: WriteOptions[ 'moduleName' ];
	globals?: WriteOptions[ 'globals' ];
	indent?: WriteOptions[ 'indent' ];
	interop?: WriteOptions[ 'interop' ];
	banner?: WriteOptions[ 'banner' ];
	footer?: WriteOptions[ 'footer' ];
	intro?: WriteOptions[ 'intro' ];
	outro?: WriteOptions[ 'outro' ];
	useStrict?: WriteOptions[ 'useStrict' ];
}

export function getRollupOutputConfig(): RollupWriteOptions {

	return {

		file: 'dist-temp/library-bundles',
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
	input: Options[ 'entry' ]; // Previously 'entry'
	cache?: Options[ 'cache' ];
	external?: Options[ 'external' ];
	paths?: Options[ 'paths' ];
	onwarn?: Options[ 'onwarn' ];
	plugins?: Options[ 'plugins' ];
	treeshake?: Options[ 'treeshake' ];
	acorn?: Options[ 'acorn' ];
	context?: Options[ 'context' ];
	moduleContext?: Options[ 'moduleContext' ];
	legacy?: Options[ 'legacy' ];
}

export function getRollupInputConfig(): RollupOptions {

	return {
		input: 'dist-temp/library-es2015/index.js', // Previously 'entry' which is now deprecated
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

