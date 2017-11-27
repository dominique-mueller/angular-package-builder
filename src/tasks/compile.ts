import { posix as path } from 'path';

import { main as angularCompilerCli } from '@angular/compiler-cli/src/main';

import { AngularPackageBuilderInternalConfig } from '../internal-config.interface';
import { getFiles } from '../utilities/get-files';
import { getTypescriptConfig, TypescriptConfig } from '../config/typescript.config';
import { writeFile } from '../utilities/write-file';

/**
 * Compile TypeScript into JavaScript
 *
 * @param config - Configuration
 * @param target - Compilation target
 */
export async function compile( config: AngularPackageBuilderInternalConfig, target: 'ES2015' | 'ES5' ): Promise<void> {

	// Create the TypeScript configuration
	const compilationEntries: Array<string> = await getCompilationEntries( config );
	const tsconfig: TypescriptConfig = getTypescriptConfig( target, config.temporary[ `build${ target }` ], compilationEntries, config );

	// Write the TypeScript configuration file
	const tsconfigPath: string = path.join( config.temporary.folder, `tsconfig.${ target.toLowerCase() }.json` );
	await writeFile( tsconfigPath, tsconfig );

	// Run Angular compiler (synchronous process!), using the tsconfig file from above
	angularCompilerCli( [ '-p', tsconfigPath ], ( errorLog: string ): void => {
		throw new Error( [
			`An error occured while trying to compile the TypeScript sources using the Angular Compiler.`,
			...improveAngularCompilerCliErrors( config, errorLog )
		].join( '\n' ) );
	} );

}

/**
 * Get TypeScript compilation entries
 *
 * @param config - Configuration
 */
async function getCompilationEntries( config: AngularPackageBuilderInternalConfig ): Promise<Array<string>> {

	// Get patterns
	const dtsPatterns: Array<string> = [
		path.join( '**', '*.d.ts' ), // Include all the typings we can find
		...config.ignored // Exclude ignored files and folders
	];

	// Get paths to matching files
	const dtsFilePaths: Array<string> = await getFiles( dtsPatterns, config.temporary.prepared, true );

	// Return compilation entries
	return [
		path.join( config.temporary.prepared, config.entry.file ), // Only one entry file is allowed!
		...dtsFilePaths // Additional TypeScript definition files (those do not count as entry files)
	];

}

/**
 * Improve the Angular Compiler CLI error log
 *
 * @param config   - Configuration
 * @param errorLog - Error log
 */
function improveAngularCompilerCliErrors( config: AngularPackageBuilderInternalConfig, errorLog: string ): Array<string> {

	return errorLog

		// Convert into list of errors
		.split( '\n' )
		.filter( ( error: string ): boolean => {
			return error !== '';
		} )

		// Fix path
		.map( ( error: string ): string => {
			return error.replace( config.temporary.prepared.split( path.sep ).pop(), config.entry.folder.split( path.sep ).pop() );
		} )

		// Prefix with error source
		.map( ( error: string ): string => {
			return errorLog.indexOf( 'warning TS0' ) !== -1 ? `[tsickle] ${ error }` : `[TypeScript] ${ error }`;
		} );

}
