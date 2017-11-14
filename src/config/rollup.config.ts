import * as path from 'path';

import { Options, Bundle, Warning, Plugin, WriteOptions } from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';

import { RollupInputConfig, RollupOutputConfig } from './rollup.config.interface';
import { dynamicImport } from '../utilities/dynamic-import';
import { MemoryFileSystem } from '../memory-file-system/memory-file-system';

/**
 * Get Rollup Input Config
 */
export async function getRollupInputConfig( sourcePath: string, name: string, dependencies: { [ dependency: string ]: string }, memoryFileSystem: MemoryFileSystem ): Promise<RollupInputConfig> {

	const commonjs = ( await dynamicImport( 'rollup-plugin-commonjs', memoryFileSystem ) );

	return {
		external: Object.keys( dependencies ),
		input: path.join( sourcePath, `${ name }.js` ), // Previously 'entry' which is now deprecated
		onwarn: ( warning ) => {

			// Ignore rewriting of 'this' to 'undefined' (might be an Angular-specific problem)
			// - Error message explanation: https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
			// - Workaround: https://github.com/rollup/rollup/issues/794#issuecomment-270803587
			if ( warning.code !== 'THIS_IS_UNDEFINED' ) {
				console.warn( warning.message );
			}

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
export function getRollupOutputConfig( name: string, format: 'es' | 'umd', dependencies: { [ dependency: string ]: string } ): RollupOutputConfig {

	return {
		exports: 'named', // We export multiple things
		format,
		globals: dependencies,
		name, // Required for UMD bundles
		sourcemap: true
	};

}
