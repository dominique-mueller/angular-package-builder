import * as fs from 'fs';
import { posix as path } from 'path';

import { Schema, validate, ValidatorResult, ValidationError } from 'jsonschema';
import * as gitignore from 'parse-gitignore';

import { AngularPackageBuilderConfig } from '../config.interface';
import { AngularPackageBuilderInternalConfig } from '../internal-config.interface';
import { getDependencyMap } from '../utilities/get-dependency-map';
import { readFile } from '../utilities/read-file';

import * as angularPackageSchema from '../../angular-package.schema.json';

/**
 * Create interna configuration
 *
 * @param configOrConfigUrl - Public configuration, or path to configuration file
 */
export async function configure( configOrConfigUrl: AngularPackageBuilderConfig | string ): Promise<AngularPackageBuilderInternalConfig> {

	// Get current working directory path (must be normalized manually)
	const cwd: string = process.cwd().replace( /\\/g, '/' );

	// Initial configuration
	const config: AngularPackageBuilderInternalConfig = {
		cwd,
		entry: {
			// file
			// folder
		},
		output: {
			// folder
		},
		temporary: {
			folder: path.join( cwd, 'dist-angular-package-builder' ),
			prepared: path.join( cwd, 'dist-angular-package-builder', 'library-prepared' ),
			buildES5: path.join( cwd, 'dist-angular-package-builder', 'library-build-es5' ),
			buildES2015: path.join( cwd, 'dist-angular-package-builder', 'library-build-es2015' ),
			bundleES2015: path.join( cwd, 'dist-angular-package-builder', 'library-bundle-es2015' ),
			bundleES5: path.join( cwd, 'dist-angular-package-builder', 'library-bundle-es5' ),
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
	let projectConfig: AngularPackageBuilderConfig;
	try {
		projectConfig = typeof configOrConfigUrl === 'string'
			? await readFile( path.join( cwd, configOrConfigUrl ) )
			: configOrConfigUrl;
	} catch ( error ) {
		throw new Error(  `The Angular Package config file at "${ path.join( cwd, configOrConfigUrl ) }" does not exist.` );
	}

	// Validate project configuration
	const validatorResult: ValidatorResult = validate( projectConfig, <Schema> angularPackageSchema );
	if ( !validatorResult.valid ) {
		const errorMessages: Array<string> = validatorResult.errors.map( ( error: ValidationError ): string => {
			return `${ error.property.replace( 'instance.', '' ).replace( 'instance', '' ) } ${ error.message }`;
		} );
		throw new Error( [
			'The given Angular Package Builder configuration is invalid. Make sure it follows the JSON schema.',
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
	config.output.folder = path.join( cwd, projectConfig.outDir );

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

	// Get information from '.gitignore' file
	config.ignored.push(
		...gitignore( path.join( cwd, '.gitignore' ) )
			.map( ( ignored: string ): string => {
				return `!${ ignored }`;
			} )
	);

	return config;

}
