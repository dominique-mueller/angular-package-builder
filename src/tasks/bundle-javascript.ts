import * as path from 'path';

import { rollup, Bundle } from 'rollup';

import { getRollupInputConfig, getRollupOutputConfig } from '../config/rollup.config';
import { RollupInputConfig, RollupOutputConfig } from 'src/config/rollup.config.interface';
import { cleanFolder } from './../utilities/clean-folder';
import { writeFile } from './../utilities/write-file';

/**
 * Generate JavaScript bundle
 */
export function bundleJavascript( sourcePath: string, destinationPath: string, name: string, format: 'ES' | 'UMD',
	dependencies: Array<string> ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Clear destination folder first
		await cleanFolder( destinationPath );

		// Create the bundle
		const rollupInputOptions: RollupInputConfig = getRollupInputConfig( sourcePath, name, dependencies );
		const bundle: Bundle = await rollup( <any> rollupInputOptions );

		// Generate bundle
		const rollupFormat: 'es' | 'umd' = format === 'ES' ? 'es' : 'umd';
		const rollupOutputOptions: RollupOutputConfig = getRollupOutputConfig( name, rollupFormat, dependencies );
		const { code, map } = await bundle.generate( <any> rollupOutputOptions );

		// Re-write sourcemap URLs (absolute -> relative using Linux path type slashes)
		map.sources = map.sources.map( ( source: string ): string => {
			return ( path.relative( sourcePath, source ) )
				.split( '\\' )
				.join( '/' );
		} );

		// Write bundle w/ sourcemaps to destination
		await Promise.all( [
			writeFile( path.join( destinationPath, `${ name }.js` ), code ),
			writeFile( path.join( destinationPath, `${ name }.js.map` ), map )
		] );

		resolve();

	} );
}
