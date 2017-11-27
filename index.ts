import { posix as path } from 'path';

import { AngularPackageBuilderConfig } from './src/config.interface';
import { AngularPackageBuilderInternalConfig } from './src/internal-config.interface';
import { createConfig } from './src/tasks/create-config';
import { deleteFolder } from './src/utilities/delete-folder';
import { ensureDependencyVersion } from './src/utilities/ensure-dependency-version';
import Logger from './src/logger/logger';
import MemoryFileSystem from './src/memory-file-system/memory-file-system';
import { AngularPackageBuilder } from './src/angular-package-builder';

import * as packageJson from './package.json';

export async function runAngularPackageBuilder(
	configOrConfigUrl: AngularPackageBuilderConfig | string = '.angular-package.json',
	debug: boolean = false,
): Promise<void> {

	Logger.empty();
	Logger.title( 'Angular Package Builder' );
	Logger.empty();

	process.env.DEBUG = debug ? 'ENABLED' : 'DISABLED';
	const startTime = new Date().getTime();

	try {

		// Preparation
		Promise.all(
			Object
				.keys( ( <any> packageJson ).peerDependencies )
				.map( ( peerDependency: string ): Promise<void> => {
					return ensureDependencyVersion( peerDependency, ( <any> packageJson ).peerDependencies[ peerDependency ] );
				} )
		);
		Logger.task( 'Configuration' );
		const config: AngularPackageBuilderInternalConfig = await createConfig( configOrConfigUrl );
		if ( debug ) {
			await deleteFolder( config.temporary.folder );
		} else {
			MemoryFileSystem.isActive = true;
			await MemoryFileSystem.fill( config.entry.folder );
		}
		await deleteFolder( config.output.folder );

		// TODO: Refactor ...
		const angularPackageBuilder: AngularPackageBuilder = new AngularPackageBuilder( config, false );

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

		if ( !debug ) {
			await MemoryFileSystem.persist( config.output.folder );
		}

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
