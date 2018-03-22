import { posix as path } from 'path';

import { OutputOptions, InputOptions, RollupWarning } from 'rollup';
import * as rollupCommonjsPlugin from 'rollup-plugin-commonjs';
import * as rollupNodeResolvePlugin from 'rollup-plugin-node-resolve';

import { AngularPackageBuilderInternalConfig } from '../internal-config.interface';
import { Logger } from '../logger/logger';

/**
 * Get Rollup Input Config
 */
export async function getRollupInputConfig( sourcePath: string, target: 'ES2015' | 'ES5' | 'UMD',
	config: AngularPackageBuilderInternalConfig ): Promise<InputOptions> {

	return {
		external: Object.keys( config.dependencies ),
		input: path.join( sourcePath, `${ config.fileName }.js` ), // Previously 'entry' which is now deprecated
		onwarn: ( warning: RollupWarning ): void => {

			// Supress THIS_IS_UNDEFINED warnings, as they're not having an effect on the bundle
			// - Documentation: https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
			// - Recommendation: https://github.com/rollup/rollup/issues/794#issuecomment-260694288
			if ( warning.code.indexOf( 'THIS_IS_UNDEFINED' ) !== -1 ) {
				return;
			}

			// Supress UNUSED_EXTERNAL_IMPORT warnings, as they're optimzation warnings
			if ( warning.code.indexOf( 'UNUSED_EXTERNAL_IMPORT' ) !== -1 ) {
				return;
			}

			// Print prettier warning log
			const betterWarningMessage: string = warning.message
				.replace( /\\/g, '/' )
				.replace( sourcePath.split( path.sep ).slice( -2 ).join( path.sep ), config.entry.folder.split( path.sep ).pop() );
			Logger.warn( `${ warning.code } – ${ betterWarningMessage } (${ target } target)` );

		},
		preserveSymlinks: true, // No idea why this is required, though ...
		plugins: [
			rollupNodeResolvePlugin(),
			rollupCommonjsPlugin()
		]
	};

}

/**
 * Get Rollup Output Config
 */
export function getRollupOutputConfig( format: 'es' | 'umd', config: AngularPackageBuilderInternalConfig ): OutputOptions {

	return {
		format,
		globals: config.dependencies,
		name: config.fileName, // Required for UMD bundles
		sourcemap: true
	};

}
