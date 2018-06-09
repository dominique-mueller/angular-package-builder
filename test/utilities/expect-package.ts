import { posix as path } from 'path';

import { expectES2015 } from './es2015/expect-es2015';
import { expectES5 } from './es5/expect-es5';
import { expectMetadata } from './metadata/expect-metadata';
import { expectSourcemap } from './sourcemap/expect-sourcemap';
import { expectTypings } from './typings/expect-typings';
import { expectUMD } from './umd/expect-umd';
import { expectPackageJson } from './package-json/expect-package-json';

/**
 * Expect Package Definition
 */
export interface ExpectPackageDefinition {
	packageName: string;
	root: string;
	files: Array<ExpectPackageDefinitionFile>;
}

/**
 * Expect Package Definition File
 */
export interface ExpectPackageDefinitionFile {
	path: string;
	classNames?: Array<string>;
	hasSourcemap: boolean;
}

/**
 * Expect package
 */
export function expectPackage( packageDefinition: ExpectPackageDefinition ): void {

    // Derive values
	const fileName: string = packageDefinition.packageName
		.split( '/' )
		.pop();
	const filesWithSourcemaps: Array<string> = packageDefinition.files
		.filter( ( file: ExpectPackageDefinitionFile ): boolean => {
			return file.hasSourcemap;
		} )
		.map( ( file: ExpectPackageDefinitionFile ): string => {
			return `${ file.path }.ts`;
		} );
	const allClassNames: Array<string> = packageDefinition.files
		.reduce( ( allClassNames: Array<string>, file: ExpectPackageDefinitionFile ): Array<string> => {
			allClassNames.push( ...( file.classNames || [] ) );
			return allClassNames;
		}, [] );

	describe( `Package: ${ packageDefinition.packageName }`, () => {

		describe( 'Output: ES2015 build', () => {

			describe( `(${ fileName }.js)`, () => {
				expectES2015( path.join( packageDefinition.root, 'dist', 'esm2015', `${ fileName }.js` ) );
			} );

			packageDefinition.files.forEach( ( file: ExpectPackageDefinitionFile ) => {

				describe( `(${ file.path }.js)`, () => {
					expectES2015( path.join( packageDefinition.root, 'dist', 'esm2015', `${ file.path }.js` ), {
						classNames: file.classNames
					} );
				} );

			} );

		} );

		describe( 'Output: FESM2015 bundle', () => {

			expectES2015( path.join( packageDefinition.root, 'dist', 'fesm2015', `${ fileName }.js` ), {
				classNames: allClassNames
			} );

		} );

		describe( 'Output: SourceMaps for FESM2015 bundle', () => {

			expectSourcemap( path.join( packageDefinition.root, 'dist', 'fesm2015', `${ fileName }.js.map` ), {
				sourceFiles: filesWithSourcemaps
			} );

		} );

		describe( 'Output: ES5 build', () => {

			describe( `(${ fileName }.js)`, () => {
				expectES5( path.join( packageDefinition.root, 'dist', 'esm2015', `${ fileName }.js` ) );
			} );

			packageDefinition.files.forEach( ( file: ExpectPackageDefinitionFile ) => {

				describe( `(${ file.path }.js)`, () => {
					expectES5( path.join( packageDefinition.root, 'dist', 'esm5', `${ file.path }.js` ), {
						classNames: file.classNames
					} );
				} );

			} );

		} );

		describe( 'Output: FESM5 bundle', () => {

			expectES5( path.join( packageDefinition.root, 'dist', 'fesm5', `${ fileName }.js` ), {
				classNames: allClassNames
			} );

		} );

		describe( 'Output: SourceMaps for FESM5 bundle', () => {

			expectSourcemap( path.join( packageDefinition.root, 'dist', 'fesm5', `${ fileName }.js.map` ), {
				sourceFiles: filesWithSourcemaps
			} );

		} );

		describe( 'Output: UMD bundle', () => {

			expectUMD( path.join( packageDefinition.root, 'dist', 'bundles', `${ fileName }.umd.js` ), {
				classNames: allClassNames
			} );

		} );

		describe( 'Output: SourceMaps for UMD bundle', () => {

			expectSourcemap( path.join( packageDefinition.root, 'dist', 'bundles', `${ fileName }.umd.js.map` ), {
				sourceFiles: filesWithSourcemaps
			} );

		} );

		describe( 'Output: TypeScript type definitions', () => {

			describe( `(${ fileName }.d.ts)`, () => {
				expectTypings( path.join( packageDefinition.root, 'dist', 'esm2015', `${ fileName }.js` ) );
			} );

			packageDefinition.files.forEach( ( file: ExpectPackageDefinitionFile ) => {

				describe( `(${ file.path }.d.ts)`, () => {
					expectTypings( path.join( packageDefinition.root, 'dist', `${ file.path }.d.ts` ), {
						classNames: file.classNames
					} );
				} );

			} );

		} );

		describe( 'Output: Angular Metadata', () => {

			expectMetadata( path.join( packageDefinition.root, 'dist', `${ fileName }.metadata.json` ), {
				packageName: packageDefinition.packageName,
				classNames: allClassNames
			} );

		} );

		describe( 'Output: Package File', () => {

			expectPackageJson( path.join( packageDefinition.root, 'dist', 'package.json' ), {
				packageName: packageDefinition.packageName
			} );

		} );

	} );

}
