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
			buildES2015: resolvePath( 'dist-temp/library-es2016' ),
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
		compileTypescript( config.packageName, 'ES5', config.folders.temporary.inline, config.folders.temporary.buildES5 ),
		compileTypescript( config.packageName, 'ES2015', config.folders.temporary.inline, config.folders.temporary.buildES2015 )
	] );
	console.log( '  Done.' );

	console.log( '' );
	console.log( '=== Success ===' );
	console.log( '' );
}

main();
