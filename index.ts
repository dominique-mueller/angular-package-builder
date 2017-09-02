import { bundleJavascript } from './src/tasks/bundle-javascript';
import { inlineResources } from './src/tasks/inline-resources';
import { compileTypescript } from './src/tasks/compile-typescript';

import { resolvePath } from './src/utilities/resolve-path';

export interface AngularPackageBuilderConfig {
	entry: {
		folder: string;
		file: string;
	};
	output: {
		folder: string;
		temporary: {
			root: string;
			prepared: string;
			buildES5: string;
			buildES2015: string;
			bundleFESM2015: string;
			bundleFESM5: string;
			bundleUMD: string;
		};
	};
	packageName: string;
}

const config: AngularPackageBuilderConfig = { // TODO: Read from files & CLI params
	entry: {
		folder: resolvePath( 'example-library/lib' ),
		file: 'index.ts'
	},
	output: {
		folder: resolvePath( 'dist' ),
		temporary: {
			root: resolvePath( 'dist-angular-package-builder' ),
			prepared: resolvePath( 'dist-angular-package-builder/library-prepared' ),
			buildES5: resolvePath( 'dist-angular-package-builder/library-build-es5' ),
			buildES2015: resolvePath( 'dist-angular-package-builder/library-build-es2015' ),
			bundleFESM2015: resolvePath( 'dist-angular-package-builder/library-bundle-fesm2015' ),
			bundleFESM5: resolvePath( 'dist-angular-package-builder/library-bundle-fesm5' ),
			bundleUMD: resolvePath( 'dist-angular-package-builder/library-bundle-umd' )
		}
	},
	packageName: 'angular-notifier'
};

async function main() {

	console.log( '' );
	console.log( '=== Angular Package Builder ===' );
	console.log( '' );

	console.log( '> Inline resources ...' );
	await inlineResources( config.entry.folder, config.output.temporary.prepared );
	console.log( '  Done.' );

	console.log( '> Compile TypeScript to JavaScript ...' );
	await Promise.all( [
		compileTypescript( config.output.temporary.prepared, config.entry.file, config.output.temporary.buildES5, config.packageName, 'ES5' ),
		compileTypescript( config.output.temporary.prepared, config.entry.file, config.output.temporary.buildES2015, config.packageName, 'ES2015' )
	] );
	console.log( '  Done.' );

	console.log( '> Create bundles ...' );
	await Promise.all( [
		await bundleJavascript( config.output.temporary.buildES2015, config.output.temporary.bundleFESM2015, config.packageName, 'ES' ),
		await bundleJavascript( config.output.temporary.buildES5, config.output.temporary.bundleFESM5, config.packageName, 'ES' ),
		await bundleJavascript( config.output.temporary.buildES5, config.output.temporary.bundleUMD, config.packageName, 'UMD' )
	] );
	console.log( '  Done.' );

	console.log( '' );
	console.log( '=== Success ===' );
	console.log( '' );
}

main();
