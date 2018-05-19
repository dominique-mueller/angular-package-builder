import { AngularPackage } from './src/angular-package';
import { AngularPackageReader } from './src/angular-package-reader';
import { AngularPackageOrchestrator } from './src/angular-package-orchestrator';
import { AngularPackageBuilder } from './src/angular-package-builder';
import { flattenArray } from './src/utilities/flatten-array';

/**
 * Run Angular Package Builder
 */
export async function runAngularPackageBuilder( angularPackageJsonPaths: Array<string> ): Promise<void> {

	// Create Angular package definitions for each angular package json file
	const angularPackages: Array<Array<AngularPackage>> = await AngularPackageReader.readAngularPackageJsonFiles( angularPackageJsonPaths );

	// Orchestrate the build
	const buildOrchestration: Array<Array<Array<Array<AngularPackage>>>> = AngularPackageOrchestrator.orchestrateAngularPackagesBuild( angularPackages );

	// Flatten (sequential builds)
	const flattenedBuildOrchestration: Array<AngularPackage> = flattenArray( buildOrchestration );
	console.log( flattenedBuildOrchestration );

	// RUN!
	// await flattenedBuildOrchestration.reduce( ( promises: Promise<any>, angularPackage: AngularPackage ): Promise<any> => {
	// 	return promises.then( ( results: Array<void> ) => {
	// 		AngularPackageBuilder.package( angularPackage ).then( ( result: void ) => {
	// 			return [ ...results, result ];
	// 		} );
	// 	} );
	// }, Promise.resolve( [] ) );

	// angularPackageAndSubPackageBuilds.forEach( ( angularPackagesOrdered: Array<Array<Array<AngularPackage>>>, index: number ) => {
	// 	console.log( '' );
	// 	console.log( '  -> LIBRARY BUILD (IN PARALLEL)', index + 1 );
	// 	angularPackagesOrdered.forEach( ( angularPackages: Array<Array<AngularPackage>>, index: number ) => {
	// 		console.log( '     -> PACKAGE BUILD STEP', index + 1 );
	// 		angularPackages.forEach( ( angularPackage: Array<AngularPackage>, index: number ) => {
	// 			console.log( '        -> BUILD EXECUTION (IN PARALLEL)', index + 1 );
	// 			angularPackage.forEach( ( subPackage: AngularPackage, index: number ) => {
	// 				console.log( `           => ${ subPackage.packageName }` );
	// 			} );
	// 		} );
	// 	} );
	// } );

	// const angularPackage = angularPackages[ 0 ];
	// await AngularPackageBuilder.package( angularPackage );

}

runAngularPackageBuilder( [
	'./test/my-library/.angular-package.json',
	'./test/my-second-library/.angular-package.json',
] );
