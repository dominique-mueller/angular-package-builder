import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from './src/interfaces/angular-package-builder-internal-config.interface';
import { bundleJavascript } from './src/tasks/bundle-javascript';
import { compileTypescript } from './src/tasks/compile-typescript';
import { composePackage } from './src/tasks/compose-package';
import { createConfig } from './src/tasks/create-config';
import { deleteFolder } from './src/utilities/delete-folder';
import { inlineResources } from './src/tasks/inline-resources';
import Logger from './src/logger/logger';
import MemoryFileSystem from './src/memory-file-system/memory-file-system';

// TODO: Enable stack trace when debug is enabled; see code below
// process.on('unhandledRejection', r => console.log(r));

export async function main() {

	// TODO: Get as CLI command
	const debug: boolean = false;
	process.env.DEBUG = debug ? 'ENABLED' : 'DISABLED';

	const startTime = new Date().getTime();

	Logger.empty();
	Logger.title( 'Angular Package Builder' );
	Logger.empty();

	try {

		// Preparation
		// TODO: Read CLI arguments, overwrite by passing in as argument
		Logger.task( 'Configuration' );
		const config: AngularPackageBuilderInternalConfig = await createConfig();

		// FILE SYSTEM
		if ( debug ) {
			await deleteFolder( config.temporary.folder );
		} else {
			MemoryFileSystem.isActive = true;
			await MemoryFileSystem.fill( config.entry.folder );
		}
		await deleteFolder( config.output.folder );

		// Step 1: Inline resources
		Logger.task( 'Inline resources' );
		await inlineResources( config );

		// Step 2: Compilation (in parallel if not DEBUG)
		Logger.task( 'Compile TypeScript into JavaScript (ES2015, ES5)' );
		if ( process.env.DEBUG === 'ENABLED' ) {
			Logger.task( 'Compile to JavaScript ES2015' );
			await compileTypescript( config, 'ES2015' );
			Logger.task( 'Compile to JavaScript ES5' );
			await compileTypescript( config, 'ES5' );
		} else {
			await Promise.all( [
				compileTypescript( config, 'ES2015' ),
				compileTypescript( config, 'ES5' )
			] );
		}

		// Step 3: Bundling (in parallel if not DEBUG)
		Logger.task( 'Create JavaScript bundles (ES2015, ES5, UMD)' );
		if ( process.env.DEBUG === 'ENABLED' ) {
			Logger.task( 'Create ES2015 bundle' );
			await bundleJavascript( config, 'ES2015' );
			Logger.task( 'Create ES5 bundle' );
			await bundleJavascript( config, 'ES5' );
			Logger.task( 'Create UMD bundle' );
			await bundleJavascript( config, 'UMD' );
		} else {
			await Promise.all( [
				bundleJavascript( config, 'ES2015' ),
				bundleJavascript( config, 'ES5' ),
				bundleJavascript( config, 'UMD' )
			] );
		}

		// Finishing up
		Logger.task( 'Compose package' );
		await composePackage( config );

		// FILE SYSTEM
		if ( !debug ) {
			await MemoryFileSystem.persist( config.output.folder );
		}

		const finishTime = new Date().getTime();
		const processTime = ( ( finishTime - startTime ) / 1000 ).toFixed( 2 );

		Logger.empty();
		Logger.success( `Angular package build is successful! [${ processTime } seconds]` );
		Logger.empty();

	} catch ( error ) {

		Logger.empty();
		Logger.error( ( <Error> error ).message );
		Logger.empty();

		throw new Error( error.message );

	}

}
