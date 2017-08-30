import { bundleJavascript } from './src/tasks/bundle-javascript';
import { inlineResources } from './src/tasks/inline-resources';
import { compileTypescript } from './src/tasks/compile-typescript';

import { resolvePath } from './src/utilities/resolve-path';

export interface AngularPackageBuilderConfig {
	folders: {
		entry: string;
		output: string;
		temporary: {
			root: string;
			inline: string;
			buildES5: string;
			buildES2015: string;
			bundles: string;
		};
	};
	packageName: string;
}

const config: AngularPackageBuilderConfig = { // TODO: Read from files & CLI params
	folders: {
		entry: resolvePath( 'example-library/lib' ),
		output: resolvePath( 'dist' ),
		temporary: {
			root: resolvePath( 'dist-temp' ),
			inline: resolvePath( 'dist-temp/library-inline' ),
			buildES5: resolvePath( 'dist-temp/library-es5' ),
			buildES2015: resolvePath( 'dist-temp/library-es2015' ),
			bundles: resolvePath( 'dist-temp/library-bundles' )
		}
	},
	packageName: 'angular-notifier'
};

async function main() {

	console.log( '' );
	console.log( '=== Angular Package Builder ===' );
	console.log( '' );

	console.log( '> Inline resources ...' );
	await inlineResources( config.folders.entry, config.folders.temporary.inline );
	console.log( '  Done.' );

	console.log( '> Compile TypeScript to JavaScript ...' );
	await Promise.all( [
		compileTypescript( config.folders.temporary.inline, config.folders.temporary.buildES5, config.packageName, 'ES5' ),
		compileTypescript( config.folders.temporary.inline, config.folders.temporary.buildES2015, config.packageName, 'ES2015' )
	] );
	console.log( '  Done.' );

	console.log( '> Create bundles ...' );
	await bundleJavascript( '', '' );
	console.log( '  Done.' );

	console.log( '' );
	console.log( '=== Success ===' );
	console.log( '' );
}

main();
