import { posix as path } from 'path';

import * as fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify( fs.readFile );


/**
 * Unit Test
 */
describe( 'TEST ', () => {

	describe( '"metadata.json"', () => {

		let metadataJsonFile: string = '';
		let metadataJsonFileContent: any | null = null;

		it ( 'should create the file', async() => {

			let currentError: Error | null = null;
			try {
				metadataJsonFile = await readFileAsync( 'test/my-library/dist/my-library.metadata.json', 'utf-8' );
			} catch ( error ) {
				currentError = error;
			}

			expect( currentError ).toBeNull();
			expect( metadataJsonFile.length ).toBeGreaterThan( 0 );

		} );

		it ( 'should generate valid JSON', async() => {

			let currentError: Error | null = null;
			try {
				metadataJsonFileContent = JSON.parse( metadataJsonFile );
				console.log( metadataJsonFileContent );
			} catch ( error ) {
				currentError = error;
			}

			expect( currentError ).toBeNull();
			expect( metadataJsonFileContent ).toEqual( expect.objectContaining( {} ) );

		} );

		it ( 'should contain the correct version', async() => {

			expect( metadataJsonFileContent.version ).toBe( 4 );

		} );

		it ( 'should contain the correct export name', async() => {

			expect( metadataJsonFileContent.importAs ).toBe( 'my-library' );

		} );

		it ( 'should contain all metadata', async() => {

			expect( Object.keys( metadataJsonFileContent.metadata ).length ).toBe( 3 );
			expect( Object.keys( metadataJsonFileContent.origins ).length ).toBe( 3 );

		} );

	} );

} );
