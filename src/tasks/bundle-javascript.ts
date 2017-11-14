import * as path from 'path';

import { Bundle } from 'rollup';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { dynamicImport } from './../utilities/dynamic-import';
import { getRollupInputConfig, getRollupOutputConfig } from '../config/rollup.config';
import { MemoryFileSystem } from './../memory-file-system/memory-file-system';
import { RollupInputConfig, RollupOutputConfig } from '../config/rollup.config.interface';

/**
 * Generate JavaScript bundle
 */
export async function bundleJavascript( config: AngularPackageBuilderInternalConfig, target: 'ES2015' | 'ES5' | 'UMD' ): Promise<void> {

	// Import
	const { rollup } = await dynamicImport( 'rollup', config.memoryFileSystem );
	const { writeFile } = await dynamicImport( './../utilities/write-file', config.memoryFileSystem );

	// Get information upfront
	let sourcePath: string;
	let destinationPath: string;
	let rollupFormat: 'es' | 'umd';
	let bundleSuffix: string;
	switch( target ) {
		case 'ES2015':
			sourcePath = config.temporary.buildES2015;
			destinationPath = config.temporary.bundleFESM2015;
			rollupFormat = 'es';
			bundleSuffix = '.es2015';
			break;
		case 'ES5':
			sourcePath = config.temporary.buildES5;
			destinationPath = config.temporary.bundleFESM5;
			rollupFormat = 'es';
			bundleSuffix = '.es5';
			break;
		case 'UMD':
			sourcePath = config.temporary.buildES5;
			destinationPath = config.temporary.bundleUMD;
			rollupFormat = 'umd';
			bundleSuffix = '.umd';
			break;
	}

	// Get rollup configuration
	const rollupInputOptions: RollupInputConfig = await getRollupInputConfig( sourcePath, config );
	const rollupOutputOptions: RollupOutputConfig = getRollupOutputConfig( rollupFormat, config );

	// Generate the bundle
	const bundle: Bundle = await rollup( rollupInputOptions );
	const { code, map } = await bundle.generate( rollupOutputOptions );

	// Re-write sourcemap URLs (absolute -> relative using Linux path type slashes)
	map.sources = map.sources.map( ( source: string ): string => {
		return path
			.relative( sourcePath, source )
			.split( '\\' )
			.join( '/' );
	} );

	// Write bundle w/ sourcemaps to destination
	await Promise.all( [
		writeFile( path.join( destinationPath, `${ config.packageName }${ bundleSuffix }.js` ), code ),
		writeFile( path.join( destinationPath, `${ config.packageName }${ bundleSuffix }.js.map` ), map )
	] );

}
