import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { dynamicImport } from './../utilities/dynamic-import';

/**
 * Compile TypeScript into JavaScript
 */
export async function composePackage( config: AngularPackageBuilderInternalConfig ): Promise<void> {

	// Import
	const { copy } = await dynamicImport( './../utilities/copy', config.memoryFileSystem );

	// Copy all files which should end up in the package
	await Promise.all( [

		// Bundles
		copy( path.join( config.temporary.bundleFESM2015, '**' ), config.output.folder ),
		copy( path.join( config.temporary.bundleFESM5, '**' ), config.output.folder ),
		copy( path.join( config.temporary.bundleUMD, '**' ), config.output.folder ),

		// Type definitions
		copy( path.join( config.temporary.buildES2015, '**', '*.d.ts' ), config.output.folder ),

		// Angular AoT metadata file
		copy( path.join( config.temporary.buildES2015, '**', '*.metadata.json' ), config.output.folder )

	] );

	// Persist the files
	if ( !config.debug ) {
		await config.memoryFileSystem.persist( config.output.folder );
	}

}
