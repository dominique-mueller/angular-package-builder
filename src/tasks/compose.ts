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

		// Bundles
		copyFiles( path.join( config.temporary.bundleES2015, '**' ), path.join( config.output.folder, 'esm2015' ) ),
		copyFiles( path.join( config.temporary.bundleES5, '**' ), path.join( config.output.folder, 'esm5' ) ),
		copyFiles( path.join( config.temporary.bundleUMD, '**' ), path.join( config.output.folder, 'bundles' ) ),

		// TypeScript definition files
		copyFiles( path.join( config.temporary.buildES2015, '**', '*.d.ts' ), config.output.folder ),

		// Angular AoT metadata files
		copyFiles( path.join( config.temporary.buildES2015, '**', '*.metadata.json' ), config.output.folder )

	] );
}
