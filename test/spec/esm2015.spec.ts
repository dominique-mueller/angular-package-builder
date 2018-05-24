import * as fs from 'fs';
import * as path from 'path';

import { importPath, distFolderPath } from './config';

/**
 * ESM2015 Module - Unit Test
 */
describe( 'ESM2015 Modules (with Source Maps)', () => {

	const distSubfolder: string = 'esm2015';
    const moduleFilePaths: Array<string> = [
		path.join( 'my-library' ),
        path.join( 'index' ),
        path.join( 'src', 'library.module' ),
        path.join( 'src', 'data', 'data.service' ),
        path.join( 'src', 'input', 'input.component' )
	];

	let moduleFileContents: Array<string> | null = null;
	let sourcemapFiles: Array<string> | null = null;
	let sourcemapFileContents: Array<any> | null = null;

	beforeAll( async () => {
		moduleFileContents = await Promise.all(
			moduleFilePaths.map( ( moduleFilePath: string ): Promise<string> => {
				return import( path.join( importPath, distSubfolder, `${ moduleFilePath }.js` ) );
			} )
		);
		sourcemapFiles = moduleFilePaths.map( ( moduleFilePath: string ): string => {
			return fs.readFileSync( path.join( distFolderPath, distSubfolder, `${ moduleFilePath }.js.map` ), 'utf-8' );
		} );
		sourcemapFileContents = sourcemapFiles.map( ( sourcemapFile: string ): string => {
			return JSON.parse( sourcemapFile );
		} );
	} );

	it( 'should all exist', () => {

		moduleFileContents.forEach( ( moduleFileContent: string ) => {
			expect( moduleFileContent ).not.toBeNull();
		} );

	} );

	it( 'should all contain classes', () => {

		expect( moduleFileContents[ 2 ][ 'LIBModule' ] ).toEqual( expect.any( Function ) );
		expect( moduleFileContents[ 3 ][ 'LIBDataService' ] ).toEqual( expect.any( Function ) );
		expect( moduleFileContents[ 4 ][ 'LIBInputComponent' ] ).toEqual( expect.any( Function ) );

	} );

	it( 'should contain inlined component template', () => {

		const componentDecorator: any = moduleFileContents[ 4 ][ 'LIBInputComponent' ].decorators[ 0 ].args[ 0 ];

		expect( componentDecorator.templateUrl ).toBeUndefined();
		expect( componentDecorator.template ).toEqual( expect.any( String ) );
		expect( componentDecorator.template.length ).toBeGreaterThan( 0 );

	} );

	it( 'should contain inlined component styles', () => {

		const componentDecorator: any = moduleFileContents[ 4 ][ 'LIBInputComponent' ].decorators[ 0 ].args[ 0 ];

		expect( componentDecorator.styleUrls ).toBeUndefined();
		expect( componentDecorator.styles ).toEqual( expect.any( Array ) );
		expect( componentDecorator.styles.length ).toBe( 1 );
		expect( componentDecorator.styles[ 0 ] ).toEqual( expect.any( String ) );
		expect( componentDecorator.styles[ 0 ].length ).toBeGreaterThan( 0 );

	} );

	it( 'should all have sourcemaps', () => {

		sourcemapFiles.forEach( ( sourcemapFile: string ) => {
			expect( sourcemapFile ).not.toBeNull();
			expect( sourcemapFile.length ).toBeGreaterThan( 0 );
		} );

		sourcemapFileContents.forEach( ( sourcemapFileContent: any ) => {
			expect( sourcemapFileContent ).not.toBeNull();
			expect( sourcemapFileContent.length ).toEqual( expect.objectContaining( {} ) );
		} );

	} );

	it( 'should all have sourcemaps with the correct version', () => {

		sourcemapFileContents.forEach( ( sourcemapFileContent: any ) => {
			expect( sourcemapFileContent.version ).toBe( 3 );
		} );

	} );

	it( 'should all have sourcemaps containing all sources', () => {

		sourcemapFileContents.forEach( ( sourcemapFileContent: any, index: number ): void => {
			expect( sourcemapFileContent.sources.length ).toBe( 1 );
			expect( sourcemapFileContent.sources[ 0 ] ).toBe( `${ moduleFilePaths[ index ] }.ts` );
		} );

	} );

} );
