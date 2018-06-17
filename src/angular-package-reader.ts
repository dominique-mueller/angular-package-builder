import { posix as path } from 'path';

import { Schema, validate, ValidatorResult, ValidationError } from 'jsonschema';

import { AngularPackageConfig, AngularSubPackageConfig } from './angular-package-config.interface';
import { AngularPackage } from './angular-package';
import { readFile } from './utilities/read-file';

import * as angularPackageSchema from '../angular-package.schema.json';

/**
 * Angular Package Reader
 */
export class AngularPackageReader {

	/**
	 * Current working directory
	 */
	private static readonly cwd: string = process.cwd().replace( /\\/g, '/' );

	/**
	 * Read and process angular package JSON files, returning a list of angular packages
	 *
	 * Example result:
	 * [
	 *   // From first angular package json file
	 *   [
	 *     "Package 1, primary entry",
	 *     "Package 1, secondary entry 1",
	 *     "Package 1, secondary entry 2"
	 *   ],
	 *   // From second angular package json file
	 *   [
	 *     "Package 2, primary entry"
	 *   ],
	 *   // ...
	 * ]
	 *
	 * @param   angularPackageJsonPaths List of paths pointing to angular package json files
	 * @returns                         Promise, resolves with list of angular packages
	 */
	public static async readAngularPackageJsonFiles( angularPackageJsonPaths: Array<string> ): Promise<Array<Array<AngularPackage>>> {

		return await Promise.all(
			angularPackageJsonPaths.map( async ( angularPackageJsonPath: string ): Promise<Array<AngularPackage>> => {

				// Read angular package config
				let angularPackageJson: AngularPackageConfig;
				try {
					angularPackageJson = await readFile( angularPackageJsonPath );
				} catch ( error ) {
					this.handleReadError( error, angularPackageJsonPath );
				}

				// Validate project configuration
				const validatorResult: ValidatorResult = validate( angularPackageJson, <Schema>angularPackageSchema );
				if ( !validatorResult.valid ) {
					this.handleValidationError( validatorResult.errors, angularPackageJsonPath );
				}

				// Create angular package
				const angularPackageCwd: string = path.dirname( path.join( this.cwd, angularPackageJsonPath ) );
				const primaryAngularPackage: AngularPackage = await new AngularPackage()
					.setRoot( angularPackageCwd )
					.setEntryFileAndOutDir( angularPackageJson.entryFile, angularPackageJson.outDir )
					.setTypescriptCompilerOptions( angularPackageJson.typescriptCompilerOptions || {} )
					.setAngularCompilerOptions( angularPackageJson.angularCompilerOptions || {} )
					.setDependencies( angularPackageJson.dependencies || {} )
					.asPrimaryEntry()
					.init();

				// Create angular packages for secondary entry points
				const secondaryAngularPackages: Array<AngularPackage> = await Promise.all(
					( angularPackageJson.secondaryEntries || [] ).map( async ( secondaryEntry: AngularSubPackageConfig ): Promise<AngularPackage> => {

						// Create angular pacakge
						return new AngularPackage()
							.setRoot( angularPackageCwd )
							.setEntryFileAndOutDir( secondaryEntry.entryFile, angularPackageJson.outDir )
							.setTypescriptCompilerOptions( angularPackageJson.typescriptCompilerOptions || {} )
							.setAngularCompilerOptions( angularPackageJson.angularCompilerOptions || {} )
							.setDependencies( angularPackageJson.dependencies || {} )
							.asSecondaryEntry()
							.init();

					} )
				);

				return [ primaryAngularPackage, ...secondaryAngularPackages ];

			} )
		);

	}

	/**
	 * Handle angular package configuration read error
	 *
	 * @param error Error
	 */
	private static handleReadError( error: Error, angularPackageJsonPath: string ): void {

		// Create log message
		const errorMessage: string = [
			'An error occured while starting the build.',
			'',
			'Message:    Cannot read the angular package configuration file.',
			'',
			'Caused by:  File System',
			`File:       ${ angularPackageJsonPath[ 0 ] === './' ? '' : './' }${ angularPackageJsonPath }`,
			`Details:    ${ error.message.split( '[' )[ 1 ].split( ']' )[ 0 ] }`,
			'',
			'Tip: Verify the path is correct, the file exists and the file is valid JSON.',
			'',
			''
		].join( '\n' );

		throw new Error( errorMessage );

	}

	/**
	 * Handle angular package configuration validation error
	 *
	 * @param errors Validation errors
	 */
	private static handleValidationError( errors: Array<ValidationError>, angularPackageJsonPath: string ): void {

		const errorDetails: Array<string> = errors
			.map( ( error: ValidationError ): string => {
				return `${ error.property.replace( 'instance.', '' ).replace( 'instance', '' ) } ${ error.message }`.trim();
			} )
			.map( ( error: string, index: number ): string => {
				return index === 0
					? `Details:    ${ error[ 0 ].toUpperCase() }${ error.slice( 1 ) }`
					: `            ${ error[ 0 ].toUpperCase() }${ error.slice( 1 ) }`;
			} );

		// Create log message
		const errorMessage: string = [
			'An error occured while starting the build.',
			'',
			'Message:    The angular package file is not valid.',
			'',
			'Caused by:  Angular Package File Validator',
			`File:       ${ angularPackageJsonPath[ 0 ] === './' ? '' : './' }${ angularPackageJsonPath }`,
			...errorDetails,
			'',
			'Tip: Verify that the angular package file is valid, following the schema defined in "angular-package.schema.json".',
			'',
			''
		].join( '\n' );

		throw new Error( errorMessage );

	}

}
