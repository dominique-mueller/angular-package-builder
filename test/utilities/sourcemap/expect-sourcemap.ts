import { posix as path } from 'path';
import * as fs from 'fs';

import { SourcemapFile } from './sourcemap-file';
import { simplifyFileContent } from '../simplify-file-content';

/**
 * Expect Sourcemap file
 */
export function expectSourcemap( filePath: string, checks: {
	sourceFiles: Array<string>
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
		const rootPath: string = filePath.split( '/dist/' )[ 0 ];

		expect( Object.keys( sources ).sort() ).toEqual( checks.sourceFiles.sort() );
		Object
			.keys( sources )
			.forEach( ( sourcePath: string ): void => {
				const sourceContent: string = fs.readFileSync( path.join( rootPath, sourcePath ), 'utf-8' );
				expect( simplifyFileContent( sources[ sourcePath ] ) ).toBe( simplifyFileContent( sourceContent ) );
			} );

	} );

}
