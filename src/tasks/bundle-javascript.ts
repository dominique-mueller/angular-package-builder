import * as path from 'path';

import * as proxyquire from 'proxyquire';
import { Bundle } from 'rollup';

import { AngularPackageBuilderConfig } from './../../index';
import { getRollupInputConfig, getRollupOutputConfig } from '../config/rollup.config';
import { MemoryFileSystem } from './../memory-file-system';
import { RollupInputConfig, RollupOutputConfig } from 'src/config/rollup.config.interface';

/**
 * Generate JavaScript bundle
 */
export function bundleJavascript( config: AngularPackageBuilderConfig, memoryFileSystem: MemoryFileSystem, target: 'ES2015' | 'ES5' | 'UMD' ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		const rollup = config.debug
			? ( await import( 'rollup' ) )
			: ( proxyquire( 'rollup', { fs: memoryFileSystem.fs } ) ).rollup;
		const writeFile = config.debug
			? ( await import( './../utilities/write-file' ) )
			: ( proxyquire( './../utilities/write-file', { fs: memoryFileSystem.fs } ) ).writeFile;

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
				bundleSuffix = '';
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

		// Generate the bundle
		const rollupInputOptions: RollupInputConfig = getRollupInputConfig( sourcePath, config.packageName, config.dependencies );
		const bundle: Bundle = await rollup( <any> rollupInputOptions );
		const rollupOutputOptions: RollupOutputConfig = getRollupOutputConfig( config.packageName, rollupFormat, config.dependencies );
		const { code, map } = await bundle.generate( <any> rollupOutputOptions );

		// Re-write sourcemap URLs (absolute -> relative using Linux path type slashes)
		map.sources = map.sources.map( ( source: string ): string => {
			return ( path.relative( sourcePath, source ) )
				.split( '\\' )
				.join( '/' );
		} );

		// Write bundle w/ sourcemaps to destination
		await Promise.all( [
			writeFile( path.join( destinationPath, `${ config.packageName }${ bundleSuffix }.js` ), code ),
			writeFile( path.join( destinationPath, `${ config.packageName }${ bundleSuffix }.js.map` ), map )
		] );

		resolve();

	} );
}
