import * as fs from 'fs';

import { AngularPackageBuilderConfig } from './src/interfaces/angular-package-builder-config.interface';
import { AngularPackageBuilderInternalConfig } from './src/interfaces/angular-package-builder-internal-config.interface';
import { bundleJavascript } from './src/tasks/bundle-javascript';
import { compileTypescript } from './src/tasks/compile-typescript';
import { composePackage } from './src/tasks/compose-package';
import { createConfig } from './src/tasks/create-config';
import { deleteFolder } from './src/utilities/delete-folder';
import { inlineResources } from './src/tasks/inline-resources';
import { MemoryFileSystem } from './src/memory-file-system/memory-file-system';
import { readFile } from './src/utilities/read-file';
import { resolvePath } from './src/utilities/resolve-path';

// TODO: Enable stack trace when debug is enabled; see code below
// process.on('unhandledRejection', r => console.log(r));

async function main() {

	console.log( '' );
	console.log( '=== Angular Package Builder ===' );
	console.log( '' );

	console.log( '> Configuring ...' );
	// TODO: Read CLI arguments, overwrite by passing in as argument
	// TODO: Remove package name overwrite
	const config: AngularPackageBuilderInternalConfig = await createConfig();
	config.packageName = 'test-library';
	// console.log( config );

	console.log( '  Done.' );

	if ( config.debug ) {
		await deleteFolder( config.temporary.folder );
	}
	await deleteFolder( config.output.folder );

	console.log( '> Inline resources ...' );
	await inlineResources( config );
	console.log( '  Done.' );

	console.log( '> Compile TypeScript to JavaScript ...' );
	await Promise.all( [
		compileTypescript( config, 'ES2015' ),
		compileTypescript( config, 'ES5' )
	] );
	console.log( '  Done.' );

	console.log( '> Create bundles ...' );
	await Promise.all( [
		bundleJavascript( config, 'ES2015' ),
		bundleJavascript( config, 'ES5' ),
		bundleJavascript( config, 'UMD' )
	] );
	console.log( '  Done.' );

	// console.log( '> Composing package ...' );
	// await composePackage( config, memoryFileSystem );
	// console.log( '  Done.' );

	// console.log( '' );
	// console.log( '=== Success ===' );
	// console.log( '' );

}

main();
