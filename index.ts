import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from './src/interfaces/angular-package-builder-internal-config.interface';
import { bundleJavascript } from './src/tasks/bundle-javascript';
import { compileTypescript } from './src/tasks/compile-typescript';
import { composePackage } from './src/tasks/compose-package';
import { createConfig } from './src/tasks/create-config';
import { deleteFolder } from './src/utilities/delete-folder';
import { inlineResources } from './src/tasks/inline-resources';
import { logger, createLogger } from './src/logger';
import { MemoryFileSystem } from './src/memory-file-system/memory-file-system';

// TODO: Enable stack trace when debug is enabled; see code below
// process.on('unhandledRejection', r => console.log(r));

export async function main() {

	// TODO: Get as CLI command
	const debug: boolean = false;

	const startTime = new Date().getTime();
	createLogger( debug );

	logger.empty();
	logger.title( 'Angular Package Builder' );
	logger.empty();

	try {

		// TODO: Read CLI arguments, overwrite by passing in as argument
		logger.task( 'Configuration' );
		const config: AngularPackageBuilderInternalConfig = await createConfig();

		if ( debug ) {
			await deleteFolder( config.temporary.folder );
		} else {
			config.memoryFileSystem = new MemoryFileSystem();
			await config.memoryFileSystem.fill( config.entry.folder );
		}
		await deleteFolder( config.output.folder );

		logger.task( 'Inline resources' );
		await inlineResources( config );

		logger.task( 'Compile TypeScript into JavaScript (ES2015, ES5)' );
		await Promise.all( [
			compileTypescript( config, 'ES2015' ),
			compileTypescript( config, 'ES5' )
		] );

		logger.task( 'Create JavaScript bundles (ES2015, ES5, UMD)' );
		await Promise.all( [
			bundleJavascript( config, 'ES2015' ),
			bundleJavascript( config, 'ES5' ),
			bundleJavascript( config, 'UMD' )
		] );

		logger.task( 'Compose package' );
		await composePackage( config );

		if ( !debug ) {
			await config.memoryFileSystem.persist( config.output.folder );
		}

		const finishTime = new Date().getTime();
		const processTime = ( ( finishTime - startTime ) / 1000 ).toFixed( 2 );

		logger.empty();
		logger.success( `Angular package build is successful! [${ processTime } seconds]` );
		logger.empty();

	} catch ( error ) {

		logger.empty();
		logger.error( ( <Error> error ).message );
		logger.empty();

		throw new Error( error );

	}

}
