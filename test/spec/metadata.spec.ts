import * as fs from 'fs';
import * as path from 'path';

import { distFolderPath } from './config';

/**
 * AoT Metadata JSON File - AoT Metadata
 */
describe( 'AoT Metadata', () => {

    let metadataJsonFile: string = '';
    let metadataJsonFileContent: any | null = null;

    beforeAll( async () => {
        metadataJsonFile = await fs.readFileSync( path.join( distFolderPath, 'my-library.metadata.json' ), 'utf-8' );
        metadataJsonFileContent = JSON.parse( metadataJsonFile );
    } );

    it( 'should exist', () => {

        expect( metadataJsonFile.length ).toBeGreaterThan( 0 );

    } );

    it( 'should be JSON', () => {

        expect( metadataJsonFileContent ).toEqual( expect.objectContaining( {} ) );

    } );

    it( 'should contain the correct version', () => {

        expect( metadataJsonFileContent.version ).toBe( 4 );

    } );

    it( 'should contain the correct import name', () => {

        expect( metadataJsonFileContent.importAs ).toBe( 'my-library' );

    } );

    it( 'should contain all meta information', () => {

        const metadata: Array<string> = Object.keys( metadataJsonFileContent.metadata );
        const origins: Array<string> = Object.keys( metadataJsonFileContent.origins );

        expect( metadataJsonFileContent.__symbolic ).toBe( 'module' );

        const metadataStructure: any = expect.objectContaining( {
            __symbolic: expect.any( String ),
            decorators: expect.any( Array ),
            members: expect.any( Object )
        } );

        expect( metadata.length ).toBe( 3 );
        expect( metadataJsonFileContent.metadata[ 'LIBModule' ] ).toEqual( metadataStructure );
        expect( metadataJsonFileContent.metadata[ 'LIBDataService' ] ).toEqual( metadataStructure );
        expect( metadataJsonFileContent.metadata[ 'LIBInputComponent' ] ).toEqual( metadataStructure );

        expect( origins.length ).toBe( 3 );
        expect( metadataJsonFileContent.origins[ 'LIBModule' ] ).toBe( './src/library.module' );
        expect( metadataJsonFileContent.origins[ 'LIBDataService' ] ).toBe( './src/data/data.service' );
        expect( metadataJsonFileContent.origins[ 'LIBInputComponent' ] ).toBe( './src/input/input.component' );

    } );

} );
