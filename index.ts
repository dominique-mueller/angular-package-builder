import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from './src/interfaces/angular-package-builder-internal-config.interface';
import { bundleJavascript } from './src/tasks/bundle-javascript';
import { compileTypescript } from './src/tasks/compile-typescript';
import { composePackage } from './src/tasks/compose-package';
import { createConfig } from './src/tasks/create-config';
import { deleteFolder } from './src/utilities/delete-folder';
import { inlineResources } from './src/tasks/inline-resources';
import { log } from './src/log';
import { MemoryFileSystem } from './src/memory-file-system/memory-file-system';


// TODO: Enable stack trace when debug is enabled; see code below
// process.on('unhandledRejection', r => console.log(r));

export async function main() {

	log();
	log( 'title', 'Angular Package Builder' );
	log();

	const startTime = new Date().getTime();

	try {

		log( 'step', 'Configuration' );
		// TODO: Read CLI arguments, overwrite by passing in as argument
		const config: AngularPackageBuilderInternalConfig = await createConfig();

		if ( config.debug ) {
			await deleteFolder( config.temporary.folder );
		} else {
			config.memoryFileSystem = new MemoryFileSystem();
			await config.memoryFileSystem.fill( config.entry.folder );
		}
		await deleteFolder( config.output.folder );

		log( 'step', 'Inline resources' );
		await inlineResources( config );

		log( 'step', 'Compile TypeScript into JavaScript (ES2015, ES5)' );
		await Promise.all( [
			compileTypescript( config, 'ES2015' ),
			compileTypescript( config, 'ES5' )
		] );

		log( 'step', 'Create JavaScript bundles (ES2015, ES5, UMD)' );
		await Promise.all( [
			bundleJavascript( config, 'ES2015' ),
			bundleJavascript( config, 'ES5' ),
			bundleJavascript( config, 'UMD' )
		] );

		log( 'step', 'Compose package' );
		await composePackage( config );

		if ( !config.debug ) {
			await config.memoryFileSystem.persist( config.output.folder );
		}

		const finishTime = new Date().getTime();
		const processTime = ( ( finishTime - startTime ) / 1000 ).toFixed( 2 );

		log();
		log( 'success', `Angular package build is successful! [${ processTime } seconds]` );
		log();

	} catch ( error ) {

		log();
		log( 'error', ( <Error> error ).message );
		log();

		throw new Error( error );

	}

}
