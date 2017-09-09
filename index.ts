import * as path from 'path';

import { bundleJavascript } from './src/tasks/bundle-javascript';
import { cleanFolder } from './src/utilities/clean-folder';
import { compileTypescript } from './src/tasks/compile-typescript';
import { composePackage } from './src/tasks/compose-package';
import { inlineResources } from './src/tasks/inline-resources';
import { MemoryFileSystem } from 'src/utilities/memory-fs';
import { resolvePath } from './src/utilities/resolve-path';

export interface AngularPackageBuilderConfig {
	debug: boolean;
	entry: {
		folder: string;
		file: string;
	};
	output: {
		folder: string;
	};
	temporary: {
		folder: string;
		prepared: string;
		buildES5: string;
		buildES2015: string;
		bundleFESM2015: string;
		bundleFESM5: string;
		bundleUMD: string;
	};
	packageName: string;
	dependencies: Array<string>;
}

const config: AngularPackageBuilderConfig = {
	debug: false,
	entry: {
		folder: resolvePath( 'example-library/lib' ), // TODO: Read from CLI param
		file: 'index.ts' // TODO: Read from CLI param
	},
	output: {
		folder: resolvePath( 'dist' ),
	},
	temporary: {
		folder: resolvePath( 'dist-angular-package-builder' ),
		prepared: resolvePath( 'dist-angular-package-builder/library-prepared' ),
		buildES5: resolvePath( 'dist-angular-package-builder/library-build-es5' ),
		buildES2015: resolvePath( 'dist-angular-package-builder/library-build-es2015' ),
		bundleFESM2015: resolvePath( 'dist-angular-package-builder/library-bundle-fesm2015' ),
		bundleFESM5: resolvePath( 'dist-angular-package-builder/library-bundle-fesm5' ),
		bundleUMD: resolvePath( 'dist-angular-package-builder/library-bundle-umd' )
	},
	packageName: 'angular-notifier', // TODO: Get from package.json 'name'
	dependencies: [ // TODO: Get from package.json 'peerDependencies'
		'@angular/core',
		'@angular/common',
		'@angular/rxjs'
	]
};

// TODO: Enable stack trace when debug is enabled; see code below
// process.on('unhandledRejection', r => console.log(r));

async function main() {

	const memoryFileSystem: MemoryFileSystem | null = config.debug
		? null
		: new MemoryFileSystem( [
			config.output.folder,
			...Object.values( config.temporary )
		] );

	console.log( '' );
	console.log( '=== Angular Package Builder ===' );
	console.log( '' );

	if ( config.debug ) {
		await cleanFolder( config.temporary.folder );
	}
	await cleanFolder( config.output.folder );

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

	if ( config.debug ) {
		await cleanFolder( config.temporary.folder );
	}

	console.log( '' );
	console.log( '=== Success ===' );
	console.log( '' );

}

main();
