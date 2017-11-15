import * as fs from 'fs';
import { posix as path } from 'path';

import { Schema, validate, ValidatorResult } from 'jsonschema';
import * as gitignore from 'parse-gitignore';

import { AngularPackageBuilderConfig } from '../interfaces/angular-package-builder-config.interface';
import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { getDependencyMap } from '../utilities/get-dependency-map';
import { MemoryFileSystem } from '../memory-file-system/memory-file-system';
import { PackageJson } from './../interfaces/package-json.interface';
import { readFile } from './../utilities/read-file';

import * as angularPackageSchema from '../angular-package.schema.json';

/**
 * Create Angular Package Builder Configuration
 */
export async function createConfig(): Promise<AngularPackageBuilderInternalConfig> {

	// Get current working directory path (must be normalized manually)
	const cwd: string = process.cwd().replace( /\\/g, '/' );

	// Initial configuration
	const config: AngularPackageBuilderInternalConfig = {
		debug: false,
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
		memoryFileSystem: null,
		packageName: '',
		dependencies: {},
		typescriptCompilerOptions: {},
		angularCompilerOptions: {},
		ignored: []
	};

	// Get information from 'package.json' file
	// TODO: Verify that package name actually exists
	const packageJson: PackageJson = await readFile( 'package.json' );
	config.packageName = packageJson.name;

	// Derive dependencies from 'package.json' file
	const packageDependencies: Array<string> = [
		...Object.keys( packageJson.dependencies || {} ),
		...Object.keys( packageJson.peerDependencies || {} ),
		...Object.keys( packageJson.optionalDependencies || {} )
	];
	const mappedPackageDependencies: { [ dependency: string ]: string } = getDependencyMap( packageDependencies );
	config.dependencies = { ...mappedPackageDependencies, ...config.dependencies };

	// Get custom project configuration
	const angularPackageJsonFilePath: string = path.join( cwd, '.angular-package.json' );
	const alwaysIgnored: Array<string> = [];
	if ( fs.existsSync( angularPackageJsonFilePath ) ) {

		// Read and validate config file
		const projectConfig: AngularPackageBuilderConfig = await readFile( angularPackageJsonFilePath );
		const validatorResult: ValidatorResult = validate( projectConfig, <Schema> angularPackageSchema );
		if ( !validatorResult.valid ) {
			// TODO: Throw error, use .errors array, put 'message' into error
			throw new Error( 'ERROR: ANGULAR PACKGE JSON FILE INVALID' );
		}

		// Set input & output details
		// TODO: Verify that the entry is a file that actually exists
		// TODO: Verify that the entry is a TypeScript file (file ending)
		config.entry.folder = path.dirname( projectConfig.entryFile );
		config.entry.file = path.basename( projectConfig.entryFile );

		if ( projectConfig.outDir ) {
			config.output.folder = path.join( cwd, projectConfig.outDir );
		}
		if ( projectConfig.hasOwnProperty( 'debug' ) ) {
			config.debug = projectConfig.debug;
		}
		config.dependencies = { ...config.dependencies, ...( projectConfig.dependencies || {} ) };
		config.typescriptCompilerOptions = { ...config.typescriptCompilerOptions, ...( projectConfig.typescriptCompilerOptions || {} ) };
		config.angularCompilerOptions = { ...config.angularCompilerOptions, ...( projectConfig.angularCompilerOptions || {} ) };

		// Get ignored files
		alwaysIgnored.push(
			path.relative( cwd, config.output.folder ).replace( /\\/g, '/' ), // Relative path!
			path.relative( cwd, config.temporary.folder ).replace( /\\/g, '/' ) // Relative path!
		);

	}

	// Get information from '.gitignore' file
	const projectIgnored: Array<string> = gitignore( path.join( cwd, '.gitignore' ), alwaysIgnored )
		.map( ( ignoredPattern: string ): string => {
			return path.relative( cwd, ignoredPattern ).replace( /\\/g, '/' );
		} )
		.map( ( ignoredPattern: string ): string => {
			return `!${ ignoredPattern }`;
		} );
	config.ignored = [ ...config.ignored, ...projectIgnored ];

	// Setup virtual file system
	if ( !config.debug ) {
		config.memoryFileSystem = new MemoryFileSystem( [
			config.output.folder,
			...Object.values( config.temporary )
		] );
	}

	return config;

}
