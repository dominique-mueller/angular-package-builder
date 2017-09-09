import * as path from 'path';

import * as proxyquire from 'proxyquire';
// import { rollup, Bundle } from 'rollup';
import { Bundle } from 'rollup';

import { memFs, memVol } from './../utilities/memory-fs';
import { getRollupInputConfig, getRollupOutputConfig } from '../config/rollup.config';
import { RollupInputConfig, RollupOutputConfig } from 'src/config/rollup.config.interface';
// import { writesFile } from './../utilities/write-file';

const debug: boolean = false;

/**
 * Generate JavaScript bundle
 */
export function bundleJavascript( sourcePath: string, destinationPath: string, name: string, format: 'ES5' | 'ES2015' | 'UMD',
	dependencies: Array<string> ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		const rollup = debug
			? ( await import( 'rollup' ) )
			: ( proxyquire( 'rollup', { fs: memFs } ) ).rollup;

		const writeFile = debug
			? ( await import( './../utilities/write-file' ) )
			: ( proxyquire( './../utilities/write-file', { fs: memFs } ) ).writeFile;

		// Create the bundle
		const rollupInputOptions: RollupInputConfig = getRollupInputConfig( sourcePath, name, dependencies );
		const bundle: Bundle = await rollup( <any> rollupInputOptions );

		// Generate bundle
		const rollupFormat: 'es' | 'umd' = format === 'UMD' ? 'umd' : 'es';
		const rollupOutputOptions: RollupOutputConfig = getRollupOutputConfig( name, rollupFormat, dependencies );
		const { code, map } = await bundle.generate( <any> rollupOutputOptions );

		// Re-write sourcemap URLs (absolute -> relative using Linux path type slashes)
		map.sources = map.sources.map( ( source: string ): string => {
			return ( path.relative( sourcePath, source ) )
				.split( '\\' )
				.join( '/' );
		} );

		// Write bundle w/ sourcemaps to destination
		const bundleSuffix: string = format === 'UMD'
			? '.umd'
			: format === 'ES5'
			? '.es5'
			: '';
		await Promise.all( [
			writeFile( path.join( destinationPath, `${ name }${ bundleSuffix }.js` ), code ),
			writeFile( path.join( destinationPath, `${ name }${ bundleSuffix }.js.map` ), map )
		] );

		console.log( '3 ----' );
		console.log( JSON.stringify( Object.keys( memVol.toJSON() ), null, '' ) );
		console.log( '3 ----' );

		resolve();

	} );
}
