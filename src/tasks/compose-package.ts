import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from '../angular-package-builder-internal-config.interface';
import { importWithFs } from '../utilities/import-with-fs';
import Logger from '../logger/logger';

let copyFiles: any;

/**
 * Compile TypeScript into JavaScript
 */
export async function composePackage( config: AngularPackageBuilderInternalConfig ): Promise<void> {

	copyFiles = ( await importWithFs( '../utilities/copy-files' ) ).copyFiles;

	// Get patterns
	const bundleFESM2015Pattern: string = path.join( config.temporary.bundleFESM2015, '**' );
	const bundleFESM5Pattern: string = path.join( config.temporary.bundleFESM5, '**' );
	const bundleUMDPattern: string = path.join( config.temporary.bundleUMD, '**' );
	const typescriptDefinitionFilesPattern: string = path.join( config.temporary.buildES2015, '**', '*.d.ts' );
	const metadataJsonPattern: string = path.join( config.temporary.buildES2015, '**', '*.metadata.json' );

	// Copy all files which should end up in the package
	Logger.debug( '' );
	Logger.debug( 'Copy files ...' );
	Logger.debug( `  "${ bundleFESM2015Pattern }" -> "${ config.output.folder }"` );
	Logger.debug( `  "${ bundleFESM5Pattern }" -> "${ config.output.folder }"` );
	Logger.debug( `  "${ bundleUMDPattern }" -> "${ config.output.folder }"` );
	Logger.debug( `  "${ typescriptDefinitionFilesPattern }" -> "${ config.output.folder }"` );
	Logger.debug( `  "${ metadataJsonPattern }" -> "${ config.output.folder }"` );
	Logger.debug( '' );
	await Promise.all( [
		copyFiles( bundleFESM2015Pattern, config.output.folder ),
		copyFiles( bundleFESM5Pattern, config.output.folder ),
		copyFiles( bundleUMDPattern, config.output.folder ),
		copyFiles( typescriptDefinitionFilesPattern, config.output.folder ),
		copyFiles( metadataJsonPattern, config.output.folder )
	] );

}
