import { posix as path } from 'path';

import { runAngularPackageBuilder } from '../index';

import { expectES2015 } from './utilities/es2015/expect-es2015';
import { expectES5 } from './utilities/es5/expect-es5';
import { expectMetadata } from './utilities/metadata/expect-metadata';
import { expectSourcemap } from './utilities/sourcemap/expect-sourcemap';
import { expectTypings } from './utilities/typings/expect-typings';
import { expectUMD } from './utilities/umd/expect-umd';
import { expectPackage } from './utilities/package/expect-package';

export const myLibraryCoreLibrary: any = { // TODO: Interface
	packageName: '@my-library/core',
	root: 'test/multiple-dependent-libraries/my-library-core',
	files: [
		{
			path: 'core', // TODO: Implicit
			hasSourcemap: false
		},
		{
			path: 'index',
			hasSourcemap: false
		},
		{
			path: 'src/library.module',
			classNames: [
				'MyLibraryCoreModule'
			],
			hasSourcemap: true
		},
		{
			path: 'src/form-control-registry/form-control-registry.service',
			classNames: [
				'UIFormControlRegistryService'
			],
			hasSourcemap: true
		}
	]
};

expectLibrary( myLibraryCoreLibrary );

export function expectLibrary( library: any ): void {

	// TODO: Uncomment the following & extract from here!
	// beforeAll( async () => {

		// Build packages
		// await runAngularPackageBuilder( [
		// 	'test/multiple-dependent-libraries/my-library-core/.angular-package.json',
		// 	'test/multiple-dependent-libraries/my-library-ui/.angular-package.json',
		// 	'test/multiple-dependent-libraries/my-library-tracking/.angular-package.json',
		// ] );

	// } );

	const fileName: string = library.packageName.split( '/' ).pop();
	const filesWithSourcemaps: Array<string> = library.files
		.filter( ( file: any ): boolean => {
			return file.hasSourcemap;
		} )
		.map( ( file: any ): string => {
			return `${ file.path }.ts`;
		} );
	const allClassNames: Array<string> = library.files.reduce( ( allClassNames: Array<string>, file: any ) => {
		allClassNames.push( ...( file.classNames || [] ) );
		return allClassNames;
	}, [] );

	describe( `Package: ${ library.packageName }`, () => {

		describe( 'Output: ES2015 build', () => {

			library.files.forEach( ( file: any ) => {

				describe( `(${ file.path }.js)`, () => {
					expectES2015( path.join( library.root, 'dist', 'esm2015', `${ file.path }.js` ), {
						classNames: file.classNames
					} );
				} );

			} );

		} );

		describe( 'Output: FESM2015 bundle', () => {

			expectES2015( path.join( library.root, 'dist', 'fesm2015', `${ fileName }.js` ), {
				classNames: allClassNames
			} );

		} );

		describe( 'Output: SourceMaps for FESM2015 bundle', () => {

			expectSourcemap( path.join( library.root, 'dist', 'fesm2015', `${ fileName }.js.map` ), {
				sourceFiles: filesWithSourcemaps
			} );

		} );

		describe( 'Output: ES5 build', () => {

			library.files.forEach( ( file: any ) => {

				describe( `(${ file.path }.js)`, () => {
					expectES5( path.join( library.root, 'dist', 'esm5', `${ file.path }.js` ), {
						classNames: file.classNames
					} );
				} );

			} );

		} );

		describe( 'Output: FESM5 bundle', () => {

			expectES5( path.join( library.root, 'dist', 'fesm5', `${ fileName }.js` ), {
				classNames: allClassNames
			} );

		} );

		describe( 'Output: SourceMaps for FESM5 bundle', () => {

			expectSourcemap( path.join( library.root, 'dist', 'fesm5', `${ fileName }.js.map` ), {
				sourceFiles: filesWithSourcemaps
			} );

		} );

		describe( 'Output: UMD bundle', () => {

			expectUMD( path.join( library.root, 'dist', 'bundles', `${ fileName }.umd.js` ), {
				classNames: allClassNames
			} );

		} );

		describe( 'Output: SourceMaps for UMD bundle', () => {

			expectSourcemap( path.join( library.root, 'dist', 'bundles', `${ fileName }.umd.js.map` ), {
				sourceFiles: filesWithSourcemaps
			} );

		} );

		describe( 'Output: TypeScript type definitions', () => {

			library.files.forEach( ( file: any ) => {

				describe( `(${ file.path }.d.ts)`, () => {
					expectTypings( path.join( library.root, 'dist', `${ file.path }.d.ts` ), {
						classNames: file.classNames
					} );
				} );

			} );

		} );

		describe( 'Output: Angular Metadata', () => {

			expectMetadata( path.join( library.root, 'dist', `${ fileName }.metadata.json` ), {
				packageName: library.packageName,
				classNames: allClassNames
			} );

		} );

		describe( 'Output: Package File', () => {

			expectPackage( path.join( library.root, 'dist', 'package.json' ), {
				packageName: library.packageName
			} );

		} );

	} );

}
