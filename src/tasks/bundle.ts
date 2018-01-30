import { posix as path } from 'path';

import { InputOptions, OutputOptions, OutputChunk, rollup } from 'rollup';
import * as parsePackageJsonName from 'parse-packagejson-name';
import * as unixify from 'unixify';

import { AngularPackageBuilderInternalConfig } from '../internal-config.interface';
import { getRollupInputConfig, getRollupOutputConfig } from '../config/rollup.config';
import { writeFile } from '../utilities/write-file';

/**
 * Generate JavaScript bundle
 *
 * @param config - Internal configuration
 * @param target - Bundle target
 */
export async function bundle( config: AngularPackageBuilderInternalConfig, target: 'ES2015' | 'ES5' | 'UMD' ): Promise<void> {

	// Get rollup configurations
	const sourcePath: string = target === 'ES2015' ? config.temporary.buildES2015 : config.temporary.buildES5;
	const rollupInputOptions: InputOptions = await getRollupInputConfig( sourcePath, target, config );
	const rollupOutputOptions: OutputOptions = getRollupOutputConfig( target === 'UMD' ? 'umd' : 'es', config );

	// Generate the bundle (code & sourcemap)
	const bundle: OutputChunk = await rollup( rollupInputOptions );
	const { code, map } = await bundle.generate( rollupOutputOptions );

	// Re-write sourcemap URLs (absolute -> relative)
	const normalizedSourcePath: string = unixify( sourcePath );
	map.sources = map.sources.map( ( sourcemapSourcePath: string ): string => {
		return path.relative( normalizedSourcePath, unixify( sourcemapSourcePath ) );
	} );

	// Write bundle and sourcemap to disk
	const fileName: string = `${ parsePackageJsonName( config.packageName ).fullName }${ target === 'UMD' ? '.umd' : '' }`;
	await Promise.all( [
		writeFile( path.join( config.temporary[ `bundle${ target }` ], `${ fileName }.js` ), code ),
		writeFile( path.join( config.temporary[ `bundle${ target }` ], `${ fileName }.js.map` ), map )
	] );

}
