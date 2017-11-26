import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from '../internal-config.interface';
import { importWithFs } from '../utilities/import-with-fs';

let copyFiles: any;

/**
 * Compile TypeScript into JavaScript
 */
export async function composePackage( config: AngularPackageBuilderInternalConfig ): Promise<void> {

	copyFiles = ( await importWithFs( '../utilities/copy-files' ) ).copyFiles;

	// Copy all files which should end up in the package
	await Promise.all( [

		// Bundles
		copyFiles( path.join( config.temporary.bundleFESM2015, '**' ), path.join( config.output.folder, 'esm2015' ) ),
		copyFiles( path.join( config.temporary.bundleFESM5, '**' ), path.join( config.output.folder, 'esm5' ) ),
		copyFiles( path.join( config.temporary.bundleUMD, '**' ), path.join( config.output.folder, 'bundles' ) ),

		// TypeScript definition files
		copyFiles( path.join( config.temporary.buildES2015, '**', '*.d.ts' ), config.output.folder ),

		// Angular AoT metadata files
		copyFiles( path.join( config.temporary.buildES2015, '**', '*.metadata.json' ), config.output.folder )

	] );

}
