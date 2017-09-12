import * as path from 'path';

import * as gitignore from 'parse-gitignore'

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { getSafePackageName } from './../utilities/get-safe-package-name';
import { PackageJson } from './../interfaces/package-json.interface';
import { readFile } from './../utilities/read-file';
import { resolvePath } from './../utilities/resolve-path';
import { getRollupDependencies } from './../config/rollup.config';

/**
 * Create Angular Package Builder Configuration
 */
export function createConfig(
	entry: string,
	output: string,
	debug: boolean = false,
	dependencies: { [ dependency: string ]: string } = {},
	compilerOptions: { [ option: string ]: any } = {}
): Promise<AngularPackageBuilderInternalConfig> {
	return new Promise<AngularPackageBuilderInternalConfig>( async( resolve: ( config: AngularPackageBuilderInternalConfig ) => void, reject: ( error: Error ) => void ) => {

		// Initial configuration
		const config: AngularPackageBuilderInternalConfig = {
			debug,
			entry: {
				// file
				// folder
			},
			output: {
				// folder
			},
			temporary: {
				folder: resolvePath( 'dist-angular-package-builder' ),
				prepared: resolvePath( 'dist-angular-package-builder/library-prepared' ),
				buildES5: resolvePath( 'dist-angular-package-builder/library-build-es5' ),
				buildES2015: resolvePath( 'dist-angular-package-builder/library-build-es2015' ),
				bundleFESM2015: resolvePath( 'dist-angular-package-builder/library-bundle-fesm2015' ),
				bundleFESM5: resolvePath( 'dist-angular-package-builder/library-bundle-fesm5' ),
				bundleUMD: resolvePath( 'dist-angular-package-builder/library-bundle-umd' )
			},
			// packageName
			// dependencies
			compilerOptions
		};

		// Set input & output details
		// TODO: Verify that the entry is a file that actually exists
		// TODO: Verify that the entry is a TypeScript file (file ending)
		config.entry.folder = resolvePath( path.dirname( entry ) );
		config.entry.file = path.basename( entry );
		config.output.folder = resolvePath( output );

		// Get package name from 'package.json' file
		// TODO: Verify that package name actually exists
		const packageJson: PackageJson = await readFile( 'package.json' );
		config.packageName = getSafePackageName( packageJson.name );

		// Get dependencies from 'package.json' file, create their mapping, finally merge with custom dependencies
		const packageDependencies: Array<string> = [];
		if ( packageJson.hasOwnProperty( 'dependencies' ) ) {
			packageDependencies.push( ...Object.keys( packageJson.dependencies ) );
		}
		if ( packageJson.hasOwnProperty( 'peerDependencies' ) ) {
			packageDependencies.push( ...Object.keys( packageJson.peerDependencies ) );
		}
		if ( packageJson.hasOwnProperty( 'optionalDependencies' ) ) {
			packageDependencies.push( ...Object.keys( packageJson.optionalDependencies ) );
		}
		const mappedPackageDependencies: { [ dependency: string ]: string } = getRollupDependencies( packageDependencies );
		config.dependencies = Object.assign( mappedPackageDependencies, dependencies );

		// Read information from '.gitignore' file
		const alwaysIgnored: Array<string> = [
			'node_modules',
			path.relative( process.cwd(), config.output.folder ).replace( '\\\\', '/' ), // Relative path!
			path.relative( process.cwd(), config.temporary.folder ).replace( '\\\\', '/' ) // Relative path!
		];
		config.ignored = gitignore( resolvePath( '.gitignore' ), alwaysIgnored );

		resolve( config );

	} );

}
