import * as path from 'path';

import * as gitignore from 'parse-gitignore'

import { AngularPackageBuilderConfig } from './../interfaces/angular-package-builder-config.interface';
import { getSafePackageName } from './../utilities/get-safe-package-name';
import { PackageJson } from './../interfaces/package-json.interface';
import { readFile } from './../utilities/read-file';
import { resolvePath } from './../utilities/resolve-path';

/**
 * Create Angular Package Builder Configuration
 */
export function createConfig( entry: string, output: string, debug: boolean ): Promise<AngularPackageBuilderConfig> {
	return new Promise<AngularPackageBuilderConfig>( async( resolve: ( config: AngularPackageBuilderConfig ) => void, reject: ( error: Error ) => void ) => {

		// Initial configuration
		const config: AngularPackageBuilderConfig = {
			debug,
			entry: {
				file: '', // Configured later on
				folder: '' // Configured later on
			},
			output: {
				folder: '' // Configured later on
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
			packageName: '', // Configured later on
			dependencies: [] // Configured later on
		};

		// Set input & output details
		// TODO: Verify that the entry is a file that actually exists
		// TODO: Verify that the entry is a TypeScript file (file ending)
		config.entry.folder = resolvePath( path.dirname( entry ) );
		config.entry.file = path.basename( entry );
		config.output.folder = resolvePath( output );

		// Read information from 'package.json' file
		// TODO: Verify that package name actually exists
		const packageJson: PackageJson = await readFile( 'package.json' );
		config.packageName = getSafePackageName( packageJson.name );
		if ( packageJson.hasOwnProperty( 'dependencies' ) ) {
			config.dependencies.push( ...Object.keys( packageJson.dependencies ) );
		}
		if ( packageJson.hasOwnProperty( 'peerDependencies' ) ) {
			config.dependencies.push( ...Object.keys( packageJson.peerDependencies ) );
		}
		if ( packageJson.hasOwnProperty( 'optionalDependencies' ) ) {
			config.dependencies.push( ...Object.keys( packageJson.optionalDependencies ) );
		}

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
