import * as fs from 'fs';
import { posix as path } from 'path';

import { Schema, validate, ValidatorResult, ValidationError } from 'jsonschema';
import * as gitignore from 'parse-gitignore';

import { AngularPackageBuilderConfig } from '../interfaces/angular-package-builder-config.interface';
import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { getDependencyMap } from '../utilities/get-dependency-map';
import { readFile } from './../utilities/read-file';
import Logger from '../logger/logger';

import * as angularPackageSchema from '../angular-package.schema.json';

/**
 * Create Angular Package Builder Configuration
 */
export async function createConfig(): Promise<AngularPackageBuilderInternalConfig> {

	// Get current working directory path (must be normalized manually)
	const cwd: string = process.cwd().replace( /\\/g, '/' );
	Logger.debug( 'Current working directory (cwd):' )
	Logger.debug( cwd )
	Logger.debug( '' )

	// Initial configuration
	const config: AngularPackageBuilderInternalConfig = {
		cwd,
		entry: {
			// file
			// folder
		},
		output: {
			folder: path.join( cwd, 'dist' ),
		},
		temporary: {
			folder: path.join( cwd, 'dist-angular-package-builder' ),
			prepared: path.join( cwd, 'dist-angular-package-builder', 'library-prepared' ),
			buildES5: path.join( cwd, 'dist-angular-package-builder', 'library-build-es5' ),
			buildES2015: path.join( cwd, 'dist-angular-package-builder', 'library-build-es2015' ),
			bundleFESM2015: path.join( cwd, 'dist-angular-package-builder', 'library-bundle-fesm2015' ),
			bundleFESM5: path.join( cwd, 'dist-angular-package-builder', 'library-bundle-fesm5' ),
			bundleUMD: path.join( cwd, 'dist-angular-package-builder', 'library-bundle-umd' )
		},
		packageName: '',
		dependencies: {},
		typescriptCompilerOptions: {},
		angularCompilerOptions: {},
		ignored: []
	};

	// Get package name and dependencies from 'package.json' file
	const packageJsonPath: string = path.join( cwd, 'package.json' );
	let packageJson: { [ key: string ]: any };
	try {
		packageJson = await readFile( packageJsonPath );
	} catch ( error ) {
		throw new Error( [
			`The "package.json" file at "${ packageJsonPath }" does not exist, or cannot be read.`,
			`Details: ${ error.message }`
		].join( '\n' ) );
	}
	if ( !packageJson.hasOwnProperty( 'name' ) ) {
		throw new Error( 'The "package.json" file has no "name" property.' );
	}
	config.packageName = packageJson.name;
	const packageDependencies: Array<string> = [
		...Object.keys( packageJson.dependencies || {} ),
		...Object.keys( packageJson.peerDependencies || {} ),
		...Object.keys( packageJson.optionalDependencies || {} )
	];
	config.dependencies = getDependencyMap( packageDependencies );

	// Get custom project configuration
	const angularPackageJsonFilePath: string = path.join( cwd, '.angular-package.json' );
	if ( fs.existsSync( angularPackageJsonFilePath ) ) {

		Logger.debug( 'Found ".angular-package.json" configuration file!' )
		Logger.debug( '' )

		// Read and validate config file
		const projectConfig: AngularPackageBuilderConfig = await readFile( angularPackageJsonFilePath );
		const validatorResult: ValidatorResult = validate( projectConfig, <Schema> angularPackageSchema );
		if ( !validatorResult.valid ) {
			const errorMessages: Array<string> = validatorResult.errors.map( ( error: ValidationError ): string => {
				return `${ error.property.replace( 'instance.', '' ).replace( 'instance', '' ) } ${ error.message }`;
			} );
			throw new Error( [
				'The ".angular-package.json" file is invalid. Make sure it follows the JSON schema.',
				errorMessages.join( '\n' )
			].join( '\n' ) );
		}

		// Set input & output details
		const entryFilePath: string = path.join( cwd, projectConfig.entryFile );
		try {
			await readFile( entryFilePath );
		} catch ( error ) {
			throw new Error( [
				`The entry file at "${ entryFilePath }" does not exist, or cannot be read.`,
				`Details: ${ error.message }`
			].join( '\n' ) );
		}
		config.entry.folder = path.dirname( entryFilePath );
		config.entry.file = path.basename( entryFilePath );
		if ( path.extname( config.entry.file ).substring( 1 ).toLowerCase() !== 'ts' ) {
			throw new Error( `The entry file at "${ entryFilePath }" is not a TypeScript file.` );
		}
		if ( projectConfig.outDir ) {
			config.output.folder = path.join( cwd, projectConfig.outDir );
		}

		// Set additional information
		config.dependencies = { ...config.dependencies, ...( projectConfig.dependencies || {} ) };
		config.typescriptCompilerOptions = projectConfig.typescriptCompilerOptions || {};
		config.angularCompilerOptions = projectConfig.angularCompilerOptions || {};

		// Get ignored files
		config.ignored.push(
			`!${ path.relative( cwd, config.output.folder ) }`,
			`!${ path.join( path.relative( cwd, config.output.folder ), '**' ) }`,
			`!${ path.relative( cwd, config.temporary.folder ) }`,
			`!${ path.join( path.relative( cwd, config.temporary.folder ), '**' ) }`
		);

	}

	// Get information from '.gitignore' file
	config.ignored.push(
		...gitignore( path.join( cwd, '.gitignore' ) )
			.map( ( ignored: string ): string => {
				return `!${ ignored }`;
			} )
	);

	Logger.debug( 'Internal Angular Package Builder Configuration:' )
	Logger.debug( config )
	Logger.debug( '' )

	return config;

}
