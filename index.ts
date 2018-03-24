import { posix as path } from 'path';

import { AngularPackageBuilderConfig } from './src/config.interface';
import { ensureDependencyVersion } from './src/utilities/ensure-dependency-version';
import { Logger } from './src/logger/logger';
import { AngularPackageBuilder } from './src/angular-package-builder';

import * as packageJson from './package.json';

/**
 * Run Angular Package Builder
 */
export async function runAngularPackageBuilder(	configOrConfigUrl?: AngularPackageBuilderConfig | string, debug?: boolean ): Promise<void> {

	try {

		Logger.empty();
		Logger.title( 'Angular Package Builder' );
		Logger.empty();

		const startTime = new Date().getTime();

		Promise.all(
			Object
				.keys( ( <any> packageJson ).peerDependencies )
				.map( ( peerDependency: string ): Promise<void> => {
					return ensureDependencyVersion( peerDependency, ( <any> packageJson ).peerDependencies[ peerDependency ] );
				} )
		);
		const angularPackageBuilder: AngularPackageBuilder = new AngularPackageBuilder();

		// Step 0: Configuration
		Logger.task( 'Configuration & Preparation' );
		await angularPackageBuilder.configure( configOrConfigUrl, debug );
		await angularPackageBuilder.prepare();

		// Step 2: Compile TypeScript into JavaScript
		Logger.task( 'Compile TypeScript into JavaScript', 'ESM2015, ESM5' );
		await Promise.all( [
			angularPackageBuilder.compile( 'esm2015' ),
			angularPackageBuilder.compile( 'esm5' ),
		] );

		// Step 3: Generate JavaScript bundles
		Logger.task( 'Generate JavaScript bundles', 'FESM2015, FESM5, UMD' );
		await Promise.all( [
			angularPackageBuilder.bundle( 'fesm2015' ),
			angularPackageBuilder.bundle( 'fesm5' ),
			angularPackageBuilder.bundle( 'umd' )
		] );

		// Step 4: Compose package
		Logger.task( 'Compose package' );
		await angularPackageBuilder.compose();

		const finishTime = new Date().getTime();
		const processTime = ( ( finishTime - startTime ) / 1000 ).toFixed( 2 );

		Logger.empty();
		Logger.success( `Success! [${ processTime } seconds]` );
		Logger.empty();

	} catch ( error ) {

		Logger.empty();
		Logger.error( ( <Error> error ).message );
		Logger.empty();

		throw new Error( error.message ); // Re-throw

	}

}
