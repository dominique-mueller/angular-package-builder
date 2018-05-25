import { posix as path } from 'path';

import { AngularPackageConfig, AngularSubPackageConfig } from './angular-package-config.interface';
import { AngularPackage } from './angular-package';
import { readFile } from './utilities/read-file';

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
				const angularPackageJson: AngularPackageConfig = await readFile( angularPackageJsonPath );
				const angularPackageCwd: string = path.dirname( path.join( this.cwd, angularPackageJsonPath ) );

				// Create angular pacakge
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

}
