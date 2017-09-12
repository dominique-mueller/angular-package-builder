import * as path from 'path';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { dynamicImport } from './../utilities/dynamic-import';
import { MemoryFileSystem } from './../memory-file-system';

/**
 * Compile TypeScript into JavaScript
 */
export function composePackage( config: AngularPackageBuilderInternalConfig, memoryFileSystem: MemoryFileSystem | null ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Import
		const copy = ( await dynamicImport( './../utilities/copy', memoryFileSystem ) ).copy;

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
			await memoryFileSystem.persist( config.output.folder );
		}

		resolve();

	} );
}
