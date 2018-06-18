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

		expect( Object.keys( sources ).sort() ).toEqual( expect.arrayContaining( checks.sourceFiles.sort() ) );

		checks.sourceFiles
			.forEach( ( sourcePath: string ): void => {

				const sourceContent: string = fs.readFileSync( path.join( checks.sourceRoot, sourcePath ), 'utf-8' );
				const simplifiedSourceContent: string = simplifyFileContent( sourceContent )
					.replace( /templateUrl:'.*'/g, '' ) // Ignore template
					.replace( /styleUrls:\[.*\]/g, '' ); // Ignore styles
				const simplifiedSourcemapContent: string = simplifyFileContent( sources[ sourcePath ] )
					.replace( /template:'.*'/g, '' ) // Ignore template
					.replace( /styles:\[.*\]/g, '' ); // Ignore styles

				expect( simplifiedSourcemapContent ).toBe( simplifyFileContent( simplifiedSourceContent ) );

			} );

	} );

}
