import { posix as path } from 'path';

import * as fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify( fs.readFile );


/**
 * Unit Test
 */
describe( 'Angular Package: Metadata', () => {

	let metadataJsonFile: string = '';
	let metadataJsonFileContent: any | null = null;

	it ( 'should exist', async() => {

		let currentError: Error | null = null;
		try {
			metadataJsonFile = await readFileAsync( 'test/my-library/dist/my-library.metadata.json', 'utf-8' );
		} catch ( error ) {
			currentError = error;
		}

		expect( currentError ).toBeNull();
		expect( metadataJsonFile.length ).toBeGreaterThan( 0 );

	} );

	it ( 'should be valid JSON', async() => {

		let currentError: Error | null = null;
		try {
			metadataJsonFileContent = JSON.parse( metadataJsonFile );
		} catch ( error ) {
			currentError = error;
		}

		expect( currentError ).toBeNull();
		expect( metadataJsonFileContent ).toEqual( expect.objectContaining( {} ) );

		expect( JSON.stringify( metadataJsonFileContent ) ).toBe( metadataJsonFile );

	} );

	it ( 'should contain minified JSON', async() => {

		expect( JSON.stringify( metadataJsonFileContent ) ).toBe( metadataJsonFile );

	} );

	it ( 'should contain the correct metadata version', async() => {

		expect( metadataJsonFileContent.version ).toBe( 4 );

	} );

	it ( 'should contain the correct import name', async() => {

		expect( metadataJsonFileContent.importAs ).toBe( 'my-library' );

	} );

	it ( 'should contain all meta information', async() => {

		const metadata: Array<string> = Object.keys( metadataJsonFileContent.metadata );
		const origins: Array<string> = Object.keys( metadataJsonFileContent.origins );

		expect( metadataJsonFileContent.__symbolic ).toBe( 'module' );

		expect( metadata.length ).toBe( 3 );
		expect( metadataJsonFileContent.metadata[ 'MyLibraryModule' ] ).toEqual( expect.objectContaining( {
			__symbolic: expect.any( String ),
			decorators: expect.any( Array ),
			members: expect.any( Object )
		} ) );
		expect( metadataJsonFileContent.metadata[ 'DataService' ] ).toEqual( expect.objectContaining( {
			__symbolic: expect.any( String ),
			decorators: expect.any( Array ),
			members: expect.any( Object )
		} ) );
		expect( metadataJsonFileContent.metadata[ 'InputComponent' ] ).toEqual( expect.objectContaining( {
			__symbolic: expect.any( String ),
			decorators: expect.any( Array ),
			members: expect.any( Object )
		} ) );

		expect( origins.length ).toBe( 3 );
		expect( metadataJsonFileContent.origins[ 'MyLibraryModule' ] ).toBe( './my-library.module' );
		expect( metadataJsonFileContent.origins[ 'DataService' ] ).toBe( './data/data.service' );
		expect( metadataJsonFileContent.origins[ 'InputComponent' ] ).toBe( './input/input.component' );

	} );

} );

describe( 'Angular Package: TODO', () => {

	it ( 'should TODO', async() => {

		expect( true ).toBe( true );

	} );

} );
