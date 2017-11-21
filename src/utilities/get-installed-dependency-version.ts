import { posix as path } from 'path';

import * as resolveModule from 'resolve';

import { readFile } from './read-file';

export async function getInstalledDependencyVersion( dependency: string, basePath: string ): Promise<string> {
	return new Promise<string>( ( resolve: ( version: string ) => void, reject: ( error: Error ) => void ): void => {

		resolveModule( path.join( dependency, 'package.json' ), {
			basedir: basePath
		}, async( error: Error, dependencyPackageJsonPath: string ): Promise<void> => {

			try {

				// The dependency could not get resolved
				if ( error ) {
					throw new Error( error.message );
				}

				// The file could not get read
				const angularCompilerCliPackageJson: any = await readFile( dependencyPackageJsonPath );

				// The version is missing
				if ( !angularCompilerCliPackageJson.hasOwnProperty( 'version' ) ) {
					throw new Error( 'The "version" is not defined.' );
				}

				resolve( angularCompilerCliPackageJson.version );

			} catch( error ) {

				reject( new Error( [
					`It seems that the package "${ dependency }" is not installed, or the installation is somehow broken.`,
					`Make sure "${ dependency }" is part of your dependencies, or try to re-install all your dependencies.`,
					error.message
				].join( '\n' ) ) );
				return;

			}

		} );

	} );

}
