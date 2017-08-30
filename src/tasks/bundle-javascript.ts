import { rollup, Bundle } from 'rollup';

import { getRollupInputConfig, getRollupOutputConfig } from '../config/rollup.config';

export function bundleJavascript( source: string, destination: string ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Create the bundle
		const rollupInputOptions: any = getRollupInputConfig(); // TODO: Interface + Params
		const bundle: Bundle = await rollup( rollupInputOptions );
		console.log( bundle );

		// generate code and a sourcemap
		// const { code: string, map: SourceMap } = await bundle.generate( outputOptions );

		// or write the bundle to disk
		const rollupOutputOptions: any = getRollupOutputConfig(); // TODO: Interface + Params
		await bundle.write( rollupOutputOptions );

		resolve();

	} );
}
