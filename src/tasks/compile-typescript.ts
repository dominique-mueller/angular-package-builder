import { posix as path } from 'path';

import { ParsedConfiguration } from '@angular/compiler-cli';

import { AngularPackageBuilderInternalConfig } from '../angular-package-builder-internal-config.interface';
import { getTypescriptConfig, TypescriptConfig } from '../config/typescript.config';
import { importWithFs } from '../utilities/import-with-fs';
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
	getFiles = ( await importWithFs( '../utilities/get-files' ) ).getFiles;
	writeFile = ( await importWithFs( '../utilities/write-file' ) ).writeFile;

	// Get patterns for TypeScript definition files
	const typeDefinitionFilePatterns: Array<string> = [
		path.join( '**', '*.d.ts' ), // Include all typings
		...config.ignored // Exclude ignored files and folders
	]
	Logger.debug( '' );
	Logger.debug( 'Patterns for TypeScript definition files:', typeDefinitionFilePatterns );
	Logger.debug( '' );

	// Get TypeScript definition file paths
	const typescriptDefinitionsFilePaths: Array<string> = await getFiles( typeDefinitionFilePatterns, config.temporary.prepared, true );
	Logger.debug( 'Found TypeScript definition files files:', typescriptDefinitionsFilePaths );
	Logger.debug( '' );

	// Get other TypeScript configuration
	const destinationPath: string = target === 'ES2015' ? config.temporary.buildES2015 : config.temporary.buildES5;
	const entryFiles: Array<string> = [
		path.join( config.temporary.prepared, config.entry.file ), // Only one entry file is allowed!
		...typescriptDefinitionsFilePaths // Additional TypeScript definition files (those do not count as entry files)
	];
	Logger.debug( 'TypeScript entry files:', entryFiles );
	Logger.debug( '' );

	// Create and write TypeScript configuration
	const typescriptConfig: TypescriptConfig = getTypescriptConfig( target, destinationPath, entryFiles, config );
	const typescriptConfigPath: string = path.join( config.temporary.folder, `tsconfig.${ target }.json` );
	await writeFile( typescriptConfigPath, typescriptConfig );
	Logger.debug( `Final TypeScript Configuration at "${ typescriptConfigPath }":`, typescriptConfig );
	Logger.debug( '' );

	// Run Angular compiler (synchronous process!), passing in the tsconfig file as the project
	Logger.debug( 'Compile TypeScript to JavaScript using the Angular Compiler CLI ...' );
	let errors: string;
	const exitCode: number = angularCompilerCli( [ '-p', typescriptConfigPath ], ( angularCompilerCliError: string ): void => {
		errors = angularCompilerCliError;
	} );
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
	Logger.debug( '' );

}
