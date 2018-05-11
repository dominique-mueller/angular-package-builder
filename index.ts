import { posix as path } from 'path';

import { AngularPackageConfig, AngularSubPackageConfig } from './src/config.interface';
import { readFile } from './src/utilities/read-file';

// TODO: Find a better name?
export interface AngularPackageConfigInternal {
	entryFile: string;
	outDir: string;
	packageName: string;
	fileName: string;
}

/**
 * Angular Package
 */
export class AngularPackage {

	/**
	 * Angular Package project directory
	 */
	private cwd: string;

	/**
	 * Primary entry point
	 */
	private primaryEntry: AngularPackageConfigInternal;

	/**
	 * List of secondary entry points
	 */
	private secondaryEntries: Array<AngularPackageConfigInternal>;

	/**
	 * Custom TypeScript compiler options
	 */
	private typescriptCompilerOptions: { [ option: string ]: any };

	/**
	 * Custom Angular compiler options
	 */
	private angularCompilerOptions: { [ option: string ]: any };

	public async withConfig( absoluteAngularPackageJsonPath: string ): Promise<void> {

		this.cwd = path.dirname( absoluteAngularPackageJsonPath );

		// Read files
		const angularPackageJson: AngularPackageConfig = await readFile( absoluteAngularPackageJsonPath );
		const absolutePackageJsonPath: string = path.join( path.dirname( absoluteAngularPackageJsonPath ), 'package.json' );
		const packageJson: any = await readFile( absolutePackageJsonPath );

		// Get primary entry information
		this.primaryEntry = {
			entryFile: path.join( path.dirname( absoluteAngularPackageJsonPath ), angularPackageJson.entryFile ),
			fileName: packageJson.name.split( '/' ).pop(),
			outDir: path.join( path.dirname( absoluteAngularPackageJsonPath ), angularPackageJson.outDir ),
			packageName: packageJson.name
		};

		// Get compiler options
		this.typescriptCompilerOptions = angularPackageJson.typescriptCompilerOptions || {};
		this.angularCompilerOptions = angularPackageJson.angularCompilerOptions || {};

		// Get secondary entry information
		this.secondaryEntries = ( angularPackageJson.secondaryEntries || [] )
			.map( ( secondaryEntry: AngularSubPackageConfig ): AngularPackageConfigInternal => {

				const absoluteSecondaryEntryFilePath: string =
					path.join( path.dirname( absoluteAngularPackageJsonPath ), secondaryEntry.entryFile );
				const secondaryEntryFolder: string =
					path.relative( path.dirname( this.primaryEntry.entryFile ), path.dirname( absoluteSecondaryEntryFilePath ) );
				const secondaryPackageName: string =
					path.join( this.primaryEntry.packageName, secondaryEntryFolder );

				return {
					entryFile: absoluteSecondaryEntryFilePath,
					fileName: secondaryPackageName.split( '/' ).pop(),
					outDir: path.join( this.primaryEntry.outDir, secondaryPackageName ),
					packageName: secondaryPackageName
				};

			} );

		// TODO: Dependencies

		// TODO: Angular Package JSON Schema Validation
		// TODO: Error Handling

	}

}

/**
 * Run Angular Package Builder
 */
export async function runAngularPackageBuilder(	angularPackageJsonUrls: Array<string> ): Promise<void> {

	const cwd: string = process.cwd()
		.replace( /\\/g, '/' );

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
	// './test/my-second-library/.angular-package.json',
] );
