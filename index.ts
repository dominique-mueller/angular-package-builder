import * as path from 'path';

import * as gitignore from 'parse-gitignore';

import { bundleJavascript } from './src/tasks/bundle-javascript';
import { compileTypescript } from './src/tasks/compile-typescript';
import { composePackage } from './src/tasks/compose-package';
import { deleteFolder } from './src/utilities/delete-folder';
import { inlineResources } from './src/tasks/inline-resources';
import { createConfig } from './src/tasks/create-config';

import { MemoryFileSystem } from './src/memory-file-system';

import { resolvePath } from './src/utilities/resolve-path';
import { readFile } from './src/utilities/read-file';
import { getSafePackageName } from './src/utilities/get-safe-package-name';

import { PackageJson } from './src/interfaces/package-json.interface';
import { AngularPackageBuilderConfig } from './src/interfaces/angular-package-builder-config.interface';

// TODO: Enable stack trace when debug is enabled; see code below
// process.on('unhandledRejection', r => console.log(r));

async function main() {

	console.log( '' );
	console.log( '=== Angular Package Builder ===' );
	console.log( '' );

	console.log( '> Configuring ...' );
	const config: AngularPackageBuilderConfig = await createConfig( 'example-library/lib/index.ts', 'dist', false );

	// TODO: Remove this temporary test
	config.packageName = 'angular-notifier';
	console.log( config );

	console.log( '  Done.' );

	const memoryFileSystem: MemoryFileSystem | null = config.debug
		? null
		: new MemoryFileSystem( [
			config.output.folder,
			...Object.values( config.temporary )
		] );

	if ( config.debug ) {
		await deleteFolder( config.temporary.folder );
	}
	await deleteFolder( config.output.folder );

	console.log( '> Inline resources ...' );
	await inlineResources( config, memoryFileSystem );
	console.log( '  Done.' );

	console.log( '> Compile TypeScript to JavaScript ...' );
	await Promise.all( [
		compileTypescript( config, memoryFileSystem, 'ES2015' ),
		compileTypescript( config, memoryFileSystem, 'ES5' )
	] );
	console.log( '  Done.' );

	console.log( '> Create bundles ...' );
	await Promise.all( [
		bundleJavascript( config, memoryFileSystem, 'ES2015' ),
		bundleJavascript( config, memoryFileSystem, 'ES5' ),
		bundleJavascript( config, memoryFileSystem, 'UMD' )
	] );
	console.log( '  Done.' );

	console.log( '> Composing package ...' );
	await composePackage( config, memoryFileSystem );
	console.log( '  Done.' );

	console.log( '' );
	console.log( '=== Success ===' );
	console.log( '' );

}

main();
