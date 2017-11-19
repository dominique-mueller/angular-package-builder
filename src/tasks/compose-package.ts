import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { importWithFs } from './../utilities/import-with-fs';

let copyFiles: any;

/**
 * Compile TypeScript into JavaScript
 */
export async function composePackage( config: AngularPackageBuilderInternalConfig ): Promise<void> {

	copyFiles = ( await importWithFs( './../utilities/copy-files' ) ).copyFiles;

	// Copy all files which should end up in the package
	await Promise.all( [

		// Bundles
		copyFiles( path.join( config.temporary.bundleFESM2015, '**' ), config.output.folder ),
		copyFiles( path.join( config.temporary.bundleFESM5, '**' ), config.output.folder ),
		copyFiles( path.join( config.temporary.bundleUMD, '**' ), config.output.folder ),

		// Type definitions
		copyFiles( path.join( config.temporary.buildES2015, '**', '*.d.ts' ), config.output.folder ),

		// Angular AoT metadata file
		copyFiles( path.join( config.temporary.buildES2015, '**', '*.metadata.json' ), config.output.folder )

	] );

}
