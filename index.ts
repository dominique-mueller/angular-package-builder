import { posix as path } from 'path';

import { AngularPackage } from './src/angular-package';
import { AngularPackageBuilder } from './src/angular-package-builder';
import { AngularPackageReader } from './src/angular-package-reader';



export class AngularPackageBuilderOrchestrator {

	public static async createAngularPackageBuildInformation( angularPackages: Array<Array<AngularPackage>> ): Promise<any> {

		const angularPackagesOrdered: Array<Array<Array<AngularPackage>>> = this.orderAngularPackages( angularPackages );

		const angularPackagesOrderedOrdered: Array<Array<Array<Array<AngularPackage>>>> =
			angularPackagesOrdered.map( ( angularPackagesOrdered: Array<Array<AngularPackage>> ) => {
				return angularPackagesOrdered.map( ( angularPackageOrdered: Array<AngularPackage> ) => {
					return this.orderAngularSubPackages( angularPackageOrdered );
				} );
			} );

		console.log( '### BUILD PLAN ###' );
		angularPackagesOrderedOrdered.forEach( ( angularPackagesOrdered: Array<Array<Array<AngularPackage>>>, index: number ) => {
			console.log( '' );
			console.log( 'RUN', index + 1 );
			angularPackagesOrdered.forEach( ( angularPackages: Array<Array<AngularPackage>>, index: number ) => {
				console.log( '  PACKAGES', index + 1 );
				angularPackages.forEach( ( angularPackage: Array<AngularPackage>, index: number ) => {
					console.log( '    PACKAGE', index + 1 );
					angularPackage.forEach( ( subPackage: AngularPackage, index: number ) => {
						// console.log( '      SUB-PACKAGE', index + 1 );
						console.log( `      -> ${ subPackage.packageName }` );
						// console.dir( subPackage, { depth: 2 } );
					} );
				} );
			} );
		} );
		console.log( '' );

		// console.dir( angularPackagesOrdered, { depth: 4 } );
		// console.dir( '---' );
		console.dir( angularPackagesOrderedOrdered, { depth: 4 } );

	}

	private static orderAngularSubPackages( angularPackages: Array<AngularPackage> ): Array<Array<AngularPackage>> {

		// Get package names (primary only)
		const packageNames: Array<string> = angularPackages.map( ( angularPackages ) => {
			return angularPackages.packageName;
		} );
		const packageNamesAlreadyInBuildChain: Array<string> = [];

		const angularPackagesOrdered: Array<Array<AngularPackage>> = [];
		while ( angularPackages.length !== 0 ) {

			// Filter out angular packages which are ready to be built
			const angularPackagesReadyForBuild: Array<AngularPackage> = [];
			angularPackages = angularPackages
				.filter( ( angularPackage: AngularPackage ) => {

					// Find local import sources
					const localImportSources: Array<string> = Object
						.keys( angularPackage.externalImportSources )
						.filter( ( dependency: string ): boolean => {
							return packageNames.indexOf( dependency ) !== -1 && packageNamesAlreadyInBuildChain.indexOf( dependency ) === -1;
						} );

					// If there are no local import sources (left), add it to the build chain
					if ( localImportSources.length === 0 ) {
						angularPackagesReadyForBuild.push( angularPackage );
						return false;
					} else {
						return true;
					}

				} );

			// Add those angular packages to the build chain
			angularPackagesOrdered.push( angularPackagesReadyForBuild );
			const packageNamesReadyForBuild: Array<string> = angularPackagesReadyForBuild.map( ( angularPackageReadyForBuild: AngularPackage ): string => {
				return angularPackageReadyForBuild.packageName;
			} );
			packageNamesAlreadyInBuildChain.push( ...packageNamesReadyForBuild );

		}

		return angularPackagesOrdered;
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

	const angularPackages: Array<Array<AngularPackage>> = await AngularPackageReader.readAngularPackageJsonFiles( angularPackageJsonPaths );

	AngularPackageBuilderOrchestrator.createAngularPackageBuildInformation( angularPackages );

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
