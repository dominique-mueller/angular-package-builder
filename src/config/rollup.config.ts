import { posix as path } from 'path';

import * as parsePackageJsonName from 'parse-packagejson-name';
import { OutputOptions, InputOptions } from 'rollup';
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
		input: path.join( sourcePath, `${ parsePackageJsonName( config.packageName ).fullName }.js` ), // Previously 'entry' which is now deprecated
		onwarn: ( warning ): void => {

			// Print prettier warning log
			const betterWarningMessage: string = warning.message
				.replace( /\\/g, '/' )
				.replace( sourcePath.split( path.sep ).slice( -2 ).join( path.sep ), config.entry.folder.split( path.sep ).pop() );
			Logger.warn( `${ warning.code } – ${ betterWarningMessage } (${ target } target)` );

		},
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
		name: parsePackageJsonName( config.packageName ).fullName, // Required for UMD bundles
		sourcemap: true
	};

}
