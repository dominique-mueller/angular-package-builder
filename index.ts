import { posix as path } from 'path';

import { AngularPackageBuilderConfig } from './src/config.interface';
import { ensureDependencyVersion } from './src/utilities/ensure-dependency-version';
import { Logger } from './src/logger/logger';
import { AngularPackageBuilder } from './src/angular-package-builder';

import * as packageJson from './package.json';

export async function runAngularPackageBuilder(
	configOrConfigUrl: AngularPackageBuilderConfig | string = '.angular-package.json',
	debug: boolean = false,
): Promise<void> {

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
		Logger.task( 'Configuration' );
		await angularPackageBuilder.configure( configOrConfigUrl, debug );

		// Step 1: Prepare
		Logger.task( 'Prepare (line endings, external resources)' );
		await angularPackageBuilder.prepare();

		// Step 2: Compile TypeScript into JavaScript
		Logger.task( 'Compile TypeScript into JavaScript (ES2015, ES5)' );
		await Promise.all( [
			angularPackageBuilder.compile( 'ES2015' ),
			angularPackageBuilder.compile( 'ES5' ),
		] );

		// Step 3: Create JavaScript bundles
		Logger.task( 'Create JavaScript bundles (ES2015, ES5, UMD)' );
		await Promise.all( [
			angularPackageBuilder.bundle( 'ES2015' ),
			angularPackageBuilder.bundle( 'ES5' ),
			angularPackageBuilder.bundle( 'UMD' )
		] );

		// Step 4: Compose package
		Logger.task( 'Compose package' );
		await angularPackageBuilder.compose();

		const finishTime = new Date().getTime();
		const processTime = ( ( finishTime - startTime ) / 1000 ).toFixed( 2 );

		Logger.empty();
		Logger.success( `Angular Package build successful! [${ processTime } seconds]` );
		Logger.empty();

	} catch ( error ) {

		Logger.empty();
		Logger.error( ( <Error> error ).message );
		Logger.empty();

		throw new Error( error.message ); // Re-throw

	}

}
