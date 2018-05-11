import { posix as path } from 'path';

import { AngularPackage } from './src/angular-package';
import { AngularPackageTransformer } from './src/transformer/angular-package.transformer';

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

	console.dir( angularPackages[ 0 ], { depth: null } );

	const angularPackage = angularPackages[ 0 ];
	const angularPackageTransformer: AngularPackageTransformer =
		new AngularPackageTransformer( angularPackage.entry.entryFile, angularPackage.entry.outDir );

	// console.log( angularPackageTransformer.getAllExternalImportSources() );
	console.log( angularPackageTransformer.sourceFiles.length );

	await angularPackageTransformer.inlineExternalTemplates();
	await angularPackageTransformer.inlineExternalStyles();
	angularPackageTransformer.convertLineBreaks();
	await angularPackageTransformer.save();

	// TODO: Save!

	// console.log( Object.keys( angularPackageTransformer.sourceFilesWithPaths ) );
	// console.log( angularPackageTransformer.sourceFiles[ 3 ].getText() );

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
