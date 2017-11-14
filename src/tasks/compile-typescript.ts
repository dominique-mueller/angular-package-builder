import * as path from 'path';

import { ParsedConfiguration } from '@angular/compiler-cli';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { dynamicImport } from './../utilities/dynamic-import';
import { getTypescriptConfig } from './../config/typescript.config';
import { resolvePath } from './../utilities/resolve-path';
import { TypescriptConfig } from './../config/typescript.config.interface';

/**
 * Compile TypeScript into JavaScript
 */
export async function compileTypescript( config: AngularPackageBuilderInternalConfig, target: 'ES2015' | 'ES5' ): Promise<void> {

	// Import
	const { main } = await dynamicImport( '@angular/compiler-cli/src/main', config.memoryFileSystem );
	const { getFiles } = await dynamicImport( './../utilities/get-files', config.memoryFileSystem );
	const { writeFile } = await dynamicImport( './../utilities/write-file', config.memoryFileSystem );

	// Get TypeScript-related information
	const typeDefinitionFilesPatterns: Array<string> = [
		path.join( '**', '*.d.ts' ),
		...config.ignored
	]
	const typescriptDefinitionsFiles: Array<string> = await getFiles( typeDefinitionFilesPatterns, config.temporary.prepared, true );
	const destinationPath: string = target === 'ES2015' ? config.temporary.buildES2015 : config.temporary.buildES5;
	const entryFiles: Array<string> = [
		path.join( config.temporary.prepared, config.entry.file ), // Only one entry file is allowed!
		...typescriptDefinitionsFiles // Additional TypeScript definition files (those do not count as entry files)
	];

	// Create and write TypeScript configuration
	const typescriptConfig: TypescriptConfig = getTypescriptConfig( target, destinationPath, entryFiles, config );
	const typescriptConfigPath: string = path.join( config.temporary.folder, `tsconfig.${ target }.json` );
	await writeFile( typescriptConfigPath, typescriptConfig );

	// Run Angular compiler (synchronous process!), passing in the tsconfig file as the project
	let error: string;
	const exitCode: number = main( [ '-p', typescriptConfigPath ], ( errorMessage: string ) => {
		error = errorMessage;
	} );
	if ( exitCode !== 0 ) {
		throw new Error( error );
	}

}
