import * as path from 'path';

import { Options, Bundle, Warning, Plugin, WriteOptions } from 'rollup';

import { RollupInputConfig, RollupOutputConfig } from './rollup.config.interface';
import { AngularPackageBuilderInternalConfig } from '../interfaces/angular-package-builder-internal-config.interface';
import { dynamicImport } from '../utilities/dynamic-import';

/**
 * Get Rollup Input Config
 */
export async function getRollupInputConfig( sourcePath: string, config: AngularPackageBuilderInternalConfig ): Promise<RollupInputConfig> {

	const commonjs = await dynamicImport( 'rollup-plugin-commonjs', config.memoryFileSystem );
	const nodeResolve = await dynamicImport( 'rollup-plugin-node-resolve', config.memoryFileSystem );

	return {
		external: Object.keys( config.dependencies ),
		input: path.join( sourcePath, `${ config.packageName }.js` ), // Previously 'entry' which is now deprecated
		onwarn: ( warning ): void => {

			// Ignore rewriting of 'this' to 'undefined' (might be an Angular-specific problem)
			// - Error message explanation: https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
			// - Workaround: https://github.com/rollup/rollup/issues/794#issuecomment-270803587
			// if ( warning.code !== 'THIS_IS_UNDEFINED' ) {
			// 	console.warn( warning.message );
			// }

		},
		plugins: [
			nodeResolve(),
			commonjs()
		]
	};

}

/**
 * Get Rollup Output Config
 */
export function getRollupOutputConfig( format: 'es' | 'umd', config: AngularPackageBuilderInternalConfig ): RollupOutputConfig {

	return {
		format,
		globals: config.dependencies,
		name: config.packageName, // Required for UMD bundles
		sourcemap: true
	};

}
