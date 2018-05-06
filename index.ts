import { posix as path } from 'path';
import * as fs from 'fs';

import { AngularPackageConfig, AngularSubPackageConfig } from './src/config.interface';
import { ensureDependencyVersion } from './src/utilities/ensure-dependency-version';
import { Logger } from './src/logger/logger';
import { AngularPackageBuilder } from './src/angular-package-builder';
import { readFile } from './src/utilities/read-file';

export class AngularPackage {

	private cwd: string;

	private entryFile: string;

	private outDir: string;

	private packageName: string;

	private fileName: string;

	private secondaryEntries: Array<AngularPackageSecondaryEntry>;

	private typescriptCompilerOptions: any;

	private angularCompilerOptions: any;

	public async withConfig( angularPackageJsonPath: string ): Promise<void> {

		// Read angular package file
		this.cwd = path.dirname( angularPackageJsonPath );
		const angularPackageJson: AngularPackageConfig = await readFile( angularPackageJsonPath );

		// Get information for main package
		this.entryFile = path.join( path.dirname( angularPackageJsonPath ), angularPackageJson.entryFile );
		this.outDir = path.join( path.dirname( angularPackageJsonPath ), angularPackageJson.outDir );
		this.typescriptCompilerOptions = angularPackageJson.typescriptCompilerOptions || {};
		this.angularCompilerOptions = angularPackageJson.angularCompilerOptions || {};

		// Read package.json file
		const packageJson: any = await readFile( path.join( path.dirname( angularPackageJsonPath ), 'package.json' ) );
		this.packageName = packageJson.name;
		this.fileName = this.packageName.split( '/' ).pop();

		// Get information for secondary entry points
		this.secondaryEntries = ( angularPackageJson.secondaryEntries || [] )
			.map( ( secondaryEntry: AngularSubPackageConfig ) => {
				const absoluteSecondaryEntryFilePath: string = path.join( path.dirname( angularPackageJsonPath ), secondaryEntry.entryFile );
				const secondaryEntryFolder: string = path.relative( path.dirname( this.entryFile ), path.dirname( absoluteSecondaryEntryFilePath ) );
				const secondaryPackageName: string = path.join( this.packageName, secondaryEntryFolder );
				return {
					entryFile: absoluteSecondaryEntryFilePath,
					outDir: path.join( this.outDir, secondaryPackageName ),
					packageName: secondaryPackageName,
					fileName: secondaryPackageName.split( '/' ).pop()
				};
			} );

		// TODO: Dependencies

		// TODO: Angular Package JSON Schema Validation
		// TODO: Error Handling

	}

}

export interface AngularPackageSecondaryEntry {
	entryFile: string;
	outDir: string;
	packageName: string;
	fileName: string;
}

/**
 * Run Angular Package Builder
 */
export async function runAngularPackageBuilder(	angularPackageJsonUrls: Array<string> ): Promise<void> {

	const cwd: string = process.cwd().replace( /\\/g, '/' );

	const angularPackages: Array<AngularPackage> = await Promise.all(
		angularPackageJsonUrls
			.map( async( angularPackageJsonUrl: string ): Promise<any> => {
				const angularPackage: AngularPackage = new AngularPackage();
				await angularPackage.withConfig( path.join( cwd, angularPackageJsonUrl ) );
				return angularPackage;
			} )
	);

	console.dir( angularPackages, { depth: null } );

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
