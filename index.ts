import { posix as path } from 'path';

import { AngularPackage } from './src/angular-package';
import { AngularPackageBuilder } from './src/angular-package-builder';
import { AngularPackageConfig, AngularSubPackageConfig, AngularPackageOptions } from './src/config.interface';
import { readFile } from './src/utilities/read-file';

/**
 * Run Angular Package Builder
 */
export async function runAngularPackageBuilder( angularPackageJsonUrls: Array<string> ): Promise<void> {

	const cwd: string = process.cwd()
		.replace( /\\/g, '/' );

	let angularPackagesWithSubPackages: Array<Array<AngularPackage>> = await Promise.all(
		angularPackageJsonUrls
			.map( async ( angularPackageJsonUrl: string ): Promise<Array<AngularPackage>> => {

				// Read angular package config
				const angularPackageJson: AngularPackageConfig = await readFile( angularPackageJsonUrl );
				const angularPackageCwd: string = path.dirname( path.join( cwd, angularPackageJsonUrl ) );

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
	const angularPackages: Array<AngularPackage> = [].concat( ...angularPackagesWithSubPackages );

	console.dir( angularPackagesWithSubPackages, { depth: 2 } );

	const packageNames: Array<string> = angularPackagesWithSubPackages.map( angularPackages => angularPackages[ 0 ].packageName );

	const buildOrder: Array<any> = [];
	const packageNamesAlreadyInBuildOrder: Array<string> = [];

	while ( angularPackagesWithSubPackages.length !== 0 ) {

		const nextToBuild: Array<Array<AngularPackage>> = [];
		angularPackagesWithSubPackages = angularPackagesWithSubPackages
			.reduce( ( packages: Array<Array<AngularPackage>>, angularPackageWithSubPackages: Array<AngularPackage> ) => {

				const intraDependencies: Array<string> = Object
					.keys( angularPackageWithSubPackages[ 0 ].dependencies )
					.filter( ( dependency: string ): boolean => {
						return packageNames.indexOf( dependency ) !== -1;
					} )
					.filter( ( dependency: string ): boolean => {
						return packageNamesAlreadyInBuildOrder.indexOf( dependency ) === -1;
					} );

				if ( intraDependencies.length === 0 ) {
					nextToBuild.push( angularPackageWithSubPackages );
				} else {
					packages.push( angularPackageWithSubPackages );
				}

				return packages;

			}, [] );

		buildOrder.push( nextToBuild );
		nextToBuild.forEach( ( angularPackageWithSubPackages: Array<AngularPackage> ) => {
			packageNamesAlreadyInBuildOrder.push( angularPackageWithSubPackages[ 0 ].packageName );
		} );

	}

	console.log( 'BUILDS NO', buildOrder.length );
	console.dir( buildOrder, { depth: 3 } );

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
