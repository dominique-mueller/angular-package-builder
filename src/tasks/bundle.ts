import { posix as path } from 'path';

import { InputOptions, OutputOptions, OutputChunk, rollup } from 'rollup';

import { AngularPackageBuilderInternalConfig } from '../internal-config.interface';
import { getRollupInputConfig, getRollupOutputConfig } from '../config/rollup.config';
import { writeFile } from '../utilities/write-file';

/**
 * Generate JavaScript bundle
 *
 * @param config - Internal configuration
 * @param target - Bundle target
 */
export async function bundle( config: AngularPackageBuilderInternalConfig, target: 'fesm2015' | 'fesm5' | 'umd' ): Promise<void> {

	// Get rollup configurations
	const sourcePath: string = target === 'fesm2015' ? config.temporary.esm2015 : config.temporary.esm5;
	const rollupInputOptions: InputOptions = await getRollupInputConfig( sourcePath, target, config );
	const rollupOutputOptions: OutputOptions = getRollupOutputConfig( target, config );

	// Generate the bundle (code & sourcemap)
	const bundle: OutputChunk = <OutputChunk> await rollup( rollupInputOptions );
	const { code, map } = await bundle.generate( rollupOutputOptions );

	// Write bundle and sourcemap to disk
	const fileName: string = `${ config.fileName }${ target === 'umd' ? '.umd' : '' }`;
	await Promise.all( [
		writeFile( path.join( config.temporary[ target ], `${ fileName }.js` ), code ),
		writeFile( path.join( config.temporary[ target ], `${ fileName }.js.map` ), map )
	] );

}
