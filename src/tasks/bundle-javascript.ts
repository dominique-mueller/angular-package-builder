import { rollup, Bundle } from 'rollup';

import { getRollupInputConfig, getRollupOutputConfig } from '../config/rollup.config';
import { RollupInputConfig, RollupOutputConfig } from 'src/config/rollup.config.interface';

/**
 * Generate JavaScript bundle
 */
export function bundleJavascript( sourcePath: string, destinationPath: string, name: string, format: 'ES' | 'UMD' ):
	Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Create the bundle
		const rollupInputOptions: RollupInputConfig = getRollupInputConfig( sourcePath, name );
		const bundle: Bundle = await rollup( <any> rollupInputOptions );

		// Write bundle to dist
		const rollupFormat: 'es' | 'umd' = format === 'ES' ? 'es' : 'umd';
		const rollupOutputOptions: RollupOutputConfig = getRollupOutputConfig( destinationPath, name, rollupFormat );
		await bundle.write( <any> rollupOutputOptions );

		resolve();

	} );
}
