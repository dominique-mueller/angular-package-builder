import { rollup, Bundle } from 'rollup';

import { getRollupInputConfig, getRollupOutputConfig } from '../config/rollup.config';

export function bundleJavascript( source: string, destination: string ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Create the bundle
		const rollupInputOptions: any = getRollupInputConfig(); // TODO: Interface + Params
		const bundle: Bundle = await rollup( rollupInputOptions );

		// Write bundle to dist
		const rollupOutputOptions: any = getRollupOutputConfig(); // TODO: Interface + Params
		await bundle.write( rollupOutputOptions );

		resolve();

	} );
}
