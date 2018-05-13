import { posix as path } from 'path';

import { AngularPackage } from './src/angular-package';
import { AngularPackageBuilder } from './src/angular-package-builder';
import { AngularPackageConfig, AngularSubPackageConfig, AngularPackageOptions } from './src/config.interface';
import { readFile } from './src/utilities/read-file';

export class AngularPackageBuilderOrchestrator {

	private static readonly cwd: string = process.cwd().replace( /\\/g, '/' );

	public static async createAngularPackageBuildInformation( angularPackageJsonFilePaths: Array<string> ): Promise<any> {

		// Process the given angular package json files
		// This will return a list containing lists of angular packages (first entry is primary, others secondary)
		const angularPackages: Array<Array<AngularPackage>> = await this.processAngularPackageJsonFiles( angularPackageJsonFilePaths );
		const angularPackagesOrdered: Array<Array<Array<AngularPackage>>> = this.orderAngularPackages( angularPackages );

		console.dir( angularPackagesOrdered, { depth: 4 } );

	}

	private static async processAngularPackageJsonFiles( angularPackageJsonFilePaths: Array<string> ): Promise<Array<Array<AngularPackage>>> {

		return await Promise.all(
			angularPackageJsonFilePaths.map( async ( angularPackageJsonUrl: string ): Promise<Array<AngularPackage>> => {

				// Read angular package config
				const angularPackageJson: AngularPackageConfig = await readFile( angularPackageJsonUrl );
				const angularPackageCwd: string = path.dirname( path.join( this.cwd, angularPackageJsonUrl ) );

				// Get configuration
				const angularPackageOptions: AngularPackageOptions = {
					entryFile: angularPackageJson.entryFile,
					outDir: angularPackageJson.outDir,
					typescriptCompilerOptions: angularPackageJson.typescriptCompilerOptions,
					angularCompilerOptions: angularPackageJson.angularCompilerOptions,
					dependencies: angularPackageJson.dependencies
				};

				// Create angular package
				const primaryAngularPackage: AngularPackage = new AngularPackage();
				await primaryAngularPackage.withConfig( angularPackageCwd, angularPackageOptions );

				// Create angular packages for secondary entry points
				const secondaryAngularPackages: Array<AngularPackage> = await Promise.all(
					( angularPackageJson.secondaryEntries || [] ).map( async ( secondaryEntry: AngularSubPackageConfig ): Promise<AngularPackage> => {

						// Get configuration
						const angularPackageOptions: AngularPackageOptions = {
							entryFile: secondaryEntry.entryFile,
							outDir: angularPackageJson.outDir,
							typescriptCompilerOptions: angularPackageJson.typescriptCompilerOptions,
							angularCompilerOptions: angularPackageJson.angularCompilerOptions,
							dependencies: angularPackageJson.dependencies
						};

						// Create angular package
						const angularPackage: AngularPackage = new AngularPackage();
						await angularPackage.withConfig( angularPackageCwd, angularPackageOptions );
						return angularPackage;

					} )
				);

				return [ primaryAngularPackage, ...secondaryAngularPackages ];

			} )
		);

	}

	private static orderAngularPackages( angularPackages: Array<Array<AngularPackage>> ): Array<Array<Array<AngularPackage>>> {

		// Get package names (primary only)
		const packageNames: Array<string> = angularPackages.map( ( angularPackages ) => {
			return angularPackages[ 0 ].packageName;
		} );
		const packageNamesAlreadyInBuildChain: Array<string> = [];

		const angularPackagesOrdered: Array<Array<Array<AngularPackage>>> = [];
		while ( angularPackages.length !== 0 ) {

			// Filter out angular packages which are ready to be built
			const angularPackagesReadyForBuild: Array<Array<AngularPackage>> = [];
			angularPackages = angularPackages
				.filter( ( angularPackage: Array<AngularPackage> ) => {

					// Find local dependencies
					const localDependencies: Array<string> = Object
						.keys( angularPackage[ 0 ].dependencies )
						.filter( ( dependency: string ): boolean => {
							return packageNames.indexOf( dependency ) !== -1 && packageNamesAlreadyInBuildChain.indexOf( dependency ) === -1;
						} );

					// If there are no local dependencies (left), add it to the build chain
					if ( localDependencies.length === 0 ) {
						angularPackagesReadyForBuild.push( angularPackage );
						return false;
					} else {
						return true;
					}

				} );

			// Add those angular packages to the build chain
			angularPackagesOrdered.push( angularPackagesReadyForBuild );
			const packageNamesReadyForBuild: Array<string> = angularPackagesReadyForBuild.map( ( angularPackageReadyForBuild: Array<AngularPackage> ): string => {
				return angularPackageReadyForBuild[ 0 ].packageName;
			} );
			packageNamesAlreadyInBuildChain.push( ...packageNamesReadyForBuild );

		}

		return angularPackagesOrdered;

	}

}

/**
 * Run Angular Package Builder
 */
export async function runAngularPackageBuilder( angularPackageJsonPaths: Array<string> ): Promise<void> {

	// const angularPackages: Array<AngularPackage> = [].concat( ...angularPackagesWithSubPackages );

	AngularPackageBuilderOrchestrator.createAngularPackageBuildInformation( angularPackageJsonPaths );

	// const angularPackage = angularPackages[ 0 ];
	// await AngularPackageBuilder.package( angularPackage );

	// try {

	// 	Logger.empty();
	// 	Logger.title( 'Angular Package Builder' );
	// 	Logger.empty();

	// 	const startTime = new Date().getTime();

	// 	// Promise.all(
	// 	// 	Object
	// 	// 		.keys( ( <any> packageJson ).peerDependencies )
	// 	// 		.map( ( peerDependency: string ): Promise<void> => {
	// 	// 			return ensureDependencyVersion( peerDependency, ( <any> packageJson ).peerDependencies[ peerDependency ] );
	// 	// 		} )
	// 	// );
	// 	const angularPackageBuilder: AngularPackageBuilder = new AngularPackageBuilder();

	// 	// Step 0: Configuration
	// 	Logger.task( 'Configuration & Preparation' );
	// 	await angularPackageBuilder.configure( configOrConfigUrl, debug );
	// 	await angularPackageBuilder.prepare();

	// 	// Step 1: Compile TypeScript into JavaScript
	// 	Logger.task( 'Compile TypeScript into JavaScript', 'esm2015, esm5' );
	// 	await Promise.all( [
	// 		angularPackageBuilder.compile( 'esm2015' ),
	// 		angularPackageBuilder.compile( 'esm5' ),
	// 	] );

	// 	// Step 2: Generate JavaScript bundles
	// 	Logger.task( 'Generate JavaScript bundles', 'fesm2015, fesm5, umd' );
	// 	await Promise.all( [
	// 		angularPackageBuilder.bundle( 'fesm2015' ),
	// 		angularPackageBuilder.bundle( 'fesm5' ),
	// 		angularPackageBuilder.bundle( 'umd' )
	// 	] );

	// 	// Step 3: Compose package
	// 	Logger.task( 'Compose package' );
	// 	await angularPackageBuilder.compose();

	// 	const finishTime = new Date().getTime();
	// 	const processTime = ( ( finishTime - startTime ) / 1000 ).toFixed( 2 );

	// 	Logger.empty();
	// 	Logger.success( `Success! [${ processTime } seconds]` );
	// 	Logger.empty();

	// } catch ( error ) {

	// 	Logger.empty();
	// 	Logger.error( ( <Error> error ).message );
	// 	Logger.empty();

	// 	throw new Error( error.message ); // Re-throw

	// }

}

runAngularPackageBuilder( [
	'./test/my-library/.angular-package.json',
	'./test/my-second-library/.angular-package.json',
] );
