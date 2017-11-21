import { posix as path } from 'path';

import * as semver from 'semver';

import { AngularPackageBuilderConfig } from './src/angular-package-builder-config.interface';
import { AngularPackageBuilderInternalConfig } from './src/angular-package-builder-internal-config.interface';
import { bundleJavascript } from './src/tasks/bundle-javascript';
import { compileTypescript } from './src/tasks/compile-typescript';
import { composePackage } from './src/tasks/compose-package';
import { createConfig } from './src/tasks/create-config';
import { deleteFolder } from './src/utilities/delete-folder';
import { getInstalledDependencyVersion } from './src/utilities/get-installed-dependency-version';
import { inlineResources } from './src/tasks/inline-resources';
import Logger from './src/logger/logger';
import MemoryFileSystem from './src/memory-file-system/memory-file-system';

export async function runAngularPackageBuilder(
	configOrConfigUrl: AngularPackageBuilderConfig | string = '.angular-package.json',
	debug: boolean = false,
): Promise<void> {

	Logger.empty();
	Logger.title( 'Angular Package Builder' );
	Logger.empty();

	process.env.DEBUG = debug ? 'ENABLED' : 'DISABLED';
	const startTime = new Date().getTime();
	const cwd: string = process.cwd().replace( /\\/g, '/' ); // Get current working directory path (must be normalized manually)

	try {

		// Preparation
		Logger.task( 'Preparation' );
		const angularCompilerCliVersion: string = await getInstalledDependencyVersion( '@angular/compiler-cli', cwd );
		if ( !semver.satisfies( angularCompilerCliVersion, '>= 5.0.0 < 6.0.0' ) ) {
			Logger.warn( [
				`It seems that version "@angular/compiler-cli" is installed in version "${ angularCompilerCliVersion }".`,
				'This version if officially not supported (">= 5.0.0 < 6.0.0"). Will try to continue anyway ...'
			].join( '\n' ) );
		}
		const config: AngularPackageBuilderInternalConfig = await createConfig( configOrConfigUrl, cwd );
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

		// Step 2: Compile TypeScript into JavaScript (in parallel if not DEBUG)
		Logger.task( 'Compile TypeScript into JavaScript (ES2015, ES5)' );
		await Promise.all( [
			compileTypescript( config, 'ES2015' ),
			compileTypescript( config, 'ES5' )
		] );

		// Step 3: Create JavaScript bundles (in parallel if not DEBUG)
		Logger.task( 'Create JavaScript bundles (ES2015, ES5, UMD)' );
		await Promise.all( [
			bundleJavascript( config, 'ES2015' ),
			bundleJavascript( config, 'ES5' ),
			bundleJavascript( config, 'UMD' )
		] );

		// Finishing up
		Logger.task( 'Compose package' );
		await composePackage( config );
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
