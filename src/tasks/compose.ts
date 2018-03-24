import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from '../internal-config.interface';
import { copyFiles } from '../utilities/copy-files';

/**
 * Compose package
 *
 * @param config - Internal configuration
 */
export async function compose( config: AngularPackageBuilderInternalConfig ): Promise<void> {
	await Promise.all( [

		// Single files
		copyFiles( path.join( config.temporary.esm2015, '**' ), path.join( config.output.folder, 'esm2015' ) ),
		copyFiles( path.join( config.temporary.esm5, '**' ), path.join( config.output.folder, 'esm5' ) ),

		// Bundles
		copyFiles( path.join( config.temporary.fesm2015, '**' ), path.join( config.output.folder, 'fesm2015' ) ),
		copyFiles( path.join( config.temporary.fesm5, '**' ), path.join( config.output.folder, 'fesm5' ) ),
		copyFiles( path.join( config.temporary.umd, '**' ), path.join( config.output.folder, 'bundles' ) ),

		// TypeScript definition files
		copyFiles( path.join( config.temporary.esm2015, '**', '*.d.ts' ), config.output.folder ),

		// Angular AoT metadata files
		copyFiles( path.join( config.temporary.esm2015, '**', '*.metadata.json' ), config.output.folder )

	] );
}
