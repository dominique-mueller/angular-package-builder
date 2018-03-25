import * as fs from 'fs';
import * as path from 'path';

import { importPath, distFolderPath } from './config';

/**
 * UMD Module - Unit Test
 */
describe( 'UMD Module (with Source Maps)', () => {

	let moduleFileContent: any = null;
	let sourceMapFile: string = '';
	let sourceMapFileContent: any | null = null;

	beforeAll( async () => {
		moduleFileContent = await import( path.join( importPath, 'bundles', 'my-library.umd.js' ) );
		sourceMapFile = await fs.readFileSync( path.join( distFolderPath, 'bundles', 'my-library.umd.js.map' ), 'utf-8' );
		sourceMapFileContent = JSON.parse( sourceMapFile );
	} );

	it( 'should exist', () => {

		expect( moduleFileContent ).not.toBeNull();

	} );

	it( 'should contain classes with attached metadata', () => {

		// Module
		expect( moduleFileContent[ 'LIBModule' ] ).toEqual( expect.any( Function ) );
		expect( moduleFileContent[ 'LIBModule' ].decorators ).toEqual( expect.any( Array ) );
		expect( moduleFileContent[ 'LIBModule' ].ctorParameters ).toEqual( expect.any( Function ) );

		// Service
		expect( moduleFileContent[ 'LIBDataService' ] ).toEqual( expect.any( Function ) );
		expect( moduleFileContent[ 'LIBDataService' ].decorators ).toEqual( expect.any( Array ) );
		expect( moduleFileContent[ 'LIBDataService' ].ctorParameters ).toEqual( expect.any( Function ) );

		// Component
		expect( moduleFileContent[ 'LIBInputComponent' ] ).toEqual( expect.any( Function ) );
		expect( moduleFileContent[ 'LIBInputComponent' ].decorators ).toEqual( expect.any( Array ) );
		expect( moduleFileContent[ 'LIBInputComponent' ].propDecorators ).toEqual( expect.any( Object ) );
		expect( moduleFileContent[ 'LIBInputComponent' ].ctorParameters ).toEqual( expect.any( Function ) );

	} );

	it( 'should contain inlined component template', () => {

		const componentDecorator: any = moduleFileContent[ 'LIBInputComponent' ].decorators[ 0 ].args[ 0 ];

		expect( componentDecorator.templateUrl ).toBeUndefined();
		expect( componentDecorator.template ).toEqual( expect.any( String ) );
		expect( componentDecorator.template.length ).toBeGreaterThan( 0 );

	} );

	it( 'should contain inlined component styles', () => {

		const componentDecorator: any = moduleFileContent[ 'LIBInputComponent' ].decorators[ 0 ].args[ 0 ];

		expect( componentDecorator.styleUrls ).toBeUndefined();
		expect( componentDecorator.styles ).toEqual( expect.any( Array ) );
		expect( componentDecorator.styles.length ).toBe( 1 );
		expect( componentDecorator.styles[ 0 ] ).toEqual( expect.any( String ) );
		expect( componentDecorator.styles[ 0 ].length ).toBeGreaterThan( 0 );

	} );

	it( 'should have sourcemaps', () => {

		expect( sourceMapFile.length ).toBeGreaterThan( 0 );
		expect( sourceMapFileContent ).toEqual( expect.objectContaining( {} ) );

	} );

	it( 'should have sourcemaps with the correct version', () => {

		expect( sourceMapFileContent.version ).toBe( 3 );

	} );

	it( 'should have sourcemaps containing all sources', () => {

		expect( sourceMapFileContent.sources ).toEqual( [
			`src/data/data.service.js`,
			`src/input/input.component.js`,
			`src/library.module.js`,
			`index.js`,
			`my-library.js`,
		] );

		expect( sourceMapFileContent.sourcesContent.length ).toBe( 5 );

	} );

	it( 'should have sourcemaps containing all names', () => {

		expect( sourceMapFileContent.names ).toEqual( expect.any( Array ) );
		expect( sourceMapFileContent.names.length ).toBeGreaterThan( 0 );

	} );

} );
