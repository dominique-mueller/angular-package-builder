import { AngularPackageBuilderInternalConfig } from './src/interfaces/angular-package-builder-internal-config.interface';
import { bundleJavascript } from './src/tasks/bundle-javascript';
import { compileTypescript } from './src/tasks/compile-typescript';
import { composePackage } from './src/tasks/compose-package';
import { createConfig } from './src/tasks/create-config';
import { deleteFolder } from './src/utilities/delete-folder';
import { inlineResources } from './src/tasks/inline-resources';
import { log } from './src/log';

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
		// TODO: Remove package name overwrite
		const config: AngularPackageBuilderInternalConfig = await createConfig();
		// config.packageName = 'test-library';

		if ( config.debug ) {
			await deleteFolder( config.temporary.folder );
		}
		await deleteFolder( config.output.folder );

		log( 'step', 'Inline resources' );
		await inlineResources( config );

		log( 'step', 'Compile TypeScript into JavaScript' );
		await Promise.all( [
			compileTypescript( config, 'ES2015' ),
			compileTypescript( config, 'ES5' )
		] );

		log( 'step', 'Create JavaScript bundles' );
		await Promise.all( [
			bundleJavascript( config, 'ES2015' ),
			bundleJavascript( config, 'ES5' ),
			bundleJavascript( config, 'UMD' )
		] );

		log( 'step', 'Compose package' );
		await composePackage( config );

		console.log( Object.keys( config.memoryFileSystem.volume.toJSON() ) );

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

// main();
