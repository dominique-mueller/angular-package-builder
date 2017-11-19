import { posix as path } from 'path';

import * as parsePackageJsonName from 'parse-packagejson-name';
import { Options, Bundle, Warning, Plugin, WriteOptions, GenerateOptions } from 'rollup';

import { AngularPackageBuilderInternalConfig } from '../interfaces/angular-package-builder-internal-config.interface';
import { importWithFs } from '../utilities/import-with-fs';

let commonjs: any;
let nodeResolve: any;

/**
 * Get Rollup Input Config
 */
export async function getRollupInputConfig( sourcePath: string, config: AngularPackageBuilderInternalConfig ): Promise<Options> {

	commonjs = await importWithFs( 'rollup-plugin-commonjs' );
	nodeResolve = await importWithFs( 'rollup-plugin-node-resolve' );

	return {
		external: Object.keys( config.dependencies ),
		input: path.join( sourcePath, `${ parsePackageJsonName( config.packageName ).fullName }.js` ), // Previously 'entry' which is now deprecated
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
export function getRollupOutputConfig( format: 'es' | 'umd', config: AngularPackageBuilderInternalConfig ): GenerateOptions {

	return {
		format,
		globals: config.dependencies,
		name: parsePackageJsonName( config.packageName ).fullName, // Required for UMD bundles
		sourcemap: true
	};

}
