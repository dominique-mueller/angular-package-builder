import { Options, Bundle, Warning, Plugin, WriteOptions } from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';

export function getRollupOutputConfig(): WriteOptions {

	return {

		dest: 'dist-temp/library-bundles',
		sourceMap: true,
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

export interface RollupOptions { // Similar to 'Options' but with the latest definitions (no deprecated options)
	input: Options[ 'entry' ];
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

