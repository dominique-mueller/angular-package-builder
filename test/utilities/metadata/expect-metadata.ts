import { posix as path } from 'path';
import * as fs from 'fs';

import { MetadataFile } from './metadata-file';

/**
 * Expect metadata file
 */
export function expectMetadata( filePath: string, checks?: {
	packageName?: string,
	classNames?: Array<string>
} ): void {

	let file: MetadataFile;

	it( 'should exist and be valid JSON', () => {
		file = new MetadataFile( filePath );
	} );

	it( 'should not be empty', () => {
		expect( file.isEmpty() ).toBe( false );
	} );

	if ( checks && checks.packageName ) {

		it( 'should have the correct export name', () => {
			expect( file.getExportName() ).toBe( checks.packageName );
		} );

	}

	if ( checks && checks.classNames && checks.classNames.length > 0 ) {

		it ( 'should contain metadata for all classes', () => {
			expect( file.getItems() ).toEqual( checks.classNames );
		} );

		it ( 'should reference all source files', () => {

			const itemsWithOrigins: { [ className: string ]: string } = file.getItemsWithOrigins();
			const rootPath: string = filePath.split( '/dist/' )[ 0 ];

			expect( Object.keys( itemsWithOrigins ) ).toEqual( checks.classNames );
			Object
				.keys( itemsWithOrigins )
				.forEach( ( className: string ): void => {
					expect( fs.existsSync( path.join( rootPath, `${ itemsWithOrigins[ className ]}.ts` ) ) );
				} );

		} );

	}

}
