import * as path from 'path';

import { Options, Bundle, Warning, Plugin, WriteOptions } from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';

import { RollupInputConfig, RollupOutputConfig } from './rollup.config.interface';

/**
 * Get Rollup Input Config
 */
export function getRollupInputConfig( sourcePath: string, name: string ): RollupInputConfig {

	return {
		external: [ // TODO: Dynamic
			'@angular/core',
			'@angular/common',
			'rxjs/Subject'
		],
		input: path.join( sourcePath, `${ name }.js` ), // Previously 'entry' which is now deprecated
		onwarn: ( warning ) => {

			// TODO: Check if any of the following early exits are needed

			// if ( warning.message.indexOf( 'treating it as an external dependency' ) > -1 ) {
			// 	return;
			// }

			// if (warning.code === 'THIS_IS_UNDEFINED') {
			// 	return;
			// }

			// For everything else, log a warning
			console.warn( warning.message );

		},
		plugins: [
			nodeResolve( {
				module: true
			} ),
		]
	};

}

/**
 * Get Rollup Output Config
 */
export function getRollupOutputConfig( destinationPath: string, name: string, format: 'es' | 'umd' ): RollupOutputConfig {

	return {
		exports: 'named', // We export multiple things
		file: path.join( destinationPath, `${ name }.js` ),
		format,
		globals: { // TODO: Dynamic
			'@angular/core': 'angular.core',
			'@angular/common': 'angular.common',
			'rxjs/Subject': 'Rx'
		},
		name, // Required for UMD bundles
		sourcemap: true
	};

}
