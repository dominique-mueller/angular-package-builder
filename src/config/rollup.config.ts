import { posix as path } from 'path';

import * as parsePackageJsonName from 'parse-packagejson-name';
import { Options, Bundle, Warning, Plugin, WriteOptions, GenerateOptions } from 'rollup';

import { AngularPackageBuilderInternalConfig } from '../interfaces/angular-package-builder-internal-config.interface';
import { importWithFs } from '../utilities/import-with-fs';
import Logger from '../logger/logger';

let commonjs: any;
let nodeResolve: any;

/**
 * Get Rollup Input Config
 */
export async function getRollupInputConfig( sourcePath: string, target: 'ES2015' | 'ES5' | 'UMD',
	config: AngularPackageBuilderInternalConfig ): Promise<Options> {

	commonjs = await importWithFs( 'rollup-plugin-commonjs' );
	nodeResolve = await importWithFs( 'rollup-plugin-node-resolve' );

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
