import { posix as path } from 'path';
import * as fs from 'fs';

import { SourcemapFile } from './sourcemap-file';
import { simplifyFileContent } from '../simplify-file-content';

/**
 * Expect Sourcemap file
 */
export function expectSourcemap( filePath: string, checks: {
	sourceRoot: string;
	sourceFiles: Array<string>;
} ): void {

	let file: SourcemapFile;

	it( 'should exist', () => {
		file = new SourcemapFile( filePath );
	} );

	it( 'should not be empty', () => {
		expect( file.isEmpty() ).toBe( false );
	} );

	it( 'should reference the bundle file', () => {
		const bundleFileName: string = path.basename( filePath ).replace( '.map', '' );
		expect( file.getFileName() ).toBe( bundleFileName );
	} );

	it( 'should reference all the source files', () => {

		const sources: { [ path: string ]: string } = file.getSources();

		// Just check that the sources we know of exist. We can't do a full equality check because older versions of Angular & TypeScript
		// also put the generated entry file into the sourcemaps (although a "real" source does not exist).
		expect( Object.keys( sources ).sort() ).toEqual( expect.arrayContaining( checks.sourceFiles.sort() ) );

		checks.sourceFiles
			.forEach( ( sourcePath: string ): void => {

				// Just check that the inlined source is not empty. We can't do further checks because in older versions of Angular &
				// TypeScript the inlined source is not 100% the same as the original source (mostly AoT compilation & Close Compiler
				// annotations are included in one but not the other).
				expect( sources[ sourcePath ].length ).toBeGreaterThan( 0 );

			} );

	} );

}
