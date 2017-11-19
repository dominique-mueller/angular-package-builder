import { posix as path } from 'path';

import { ParsedConfiguration } from '@angular/compiler-cli';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { importWithFs } from './../utilities/import-with-fs';
import { getTypescriptConfig } from './../config/typescript.config';
import { TypescriptConfig } from './../config/typescript.config.interface';

let angularCompilerCli: any;
let getFiles: any;
let writeFile: any;

/**
 * Compile TypeScript into JavaScript
 */
export async function compileTypescript( config: AngularPackageBuilderInternalConfig, target: 'ES2015' | 'ES5' ): Promise<void> {

	// Import
	angularCompilerCli = ( await importWithFs( '@angular/compiler-cli/src/main' ) ).main;
	getFiles = ( await importWithFs( './../utilities/get-files' ) ).getFiles;
	writeFile = ( await importWithFs( './../utilities/write-file' ) ).writeFile;

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
	const exitCode: number = angularCompilerCli( [ '-p', typescriptConfigPath ], ( errorMessage: string ) => {
		error = errorMessage;
	} );
	if ( exitCode !== 0 ) {
		throw new Error( error );
	}

}
