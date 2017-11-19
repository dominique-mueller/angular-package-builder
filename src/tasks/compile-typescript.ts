import { posix as path } from 'path';

import { ParsedConfiguration } from '@angular/compiler-cli';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { getTypescriptConfig } from './../config/typescript.config';
import { importWithFs } from './../utilities/import-with-fs';
import { TypescriptConfig } from './../config/typescript.config.interface';
import Logger from '../logger/logger';

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
	Logger.debug( `TypeScript Configuration at "${ typescriptConfigPath }":` );
	Logger.debug( typescriptConfig );
	Logger.debug( '' );

	// Run Angular compiler (synchronous process!), passing in the tsconfig file as the project
	Logger.debug( 'Compile TypeScript to JavaScript using the Angular Compiler CLI ...' );
	let errors: string;
	const exitCode: number = angularCompilerCli( [ '-p', typescriptConfigPath ], ( angularCompilerCliError: string ): void => {
		errors = angularCompilerCliError;
	} );
	Logger.debug( '' );
	if ( exitCode !== 0 ) {

		// Fix path, add prefix to messages
		const errorMessages: Array<string> = errors
			.split( '\n' )
			.filter( ( error: string ): boolean => {
				return error !== '';
			} )
			.map( ( error: string ): string => {
				return error.replace( config.temporary.prepared.split( path.sep ).pop(), config.entry.folder.split( path.sep ).pop() );
			} )
			.map( ( error: string ): string => {
				return errors.indexOf( 'warning TS0' ) !== -1 ? `[tsickle] ${ error }` : `[TypeScript] ${ error }`;
			} );

		// Throw error
		throw new Error( [
			`An error occured while trying to compile the TypeScript sources using the Angular Compiler.`,
			...errorMessages
		].join( '\n' ) );

	}

}
