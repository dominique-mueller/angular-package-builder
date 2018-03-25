import * as fs from 'fs';
import * as path from 'path';

import { distFolderPath } from './config';

/**
 * TypeScript Definitions - Unit Test
 */
describe( 'TypeScript Definitions', () => {

    const entryFilePath: string = path.join( distFolderPath, 'my-library.d.ts' );
    const moduleFilePaths: Array<string> = [
        path.join( distFolderPath, 'index.d.ts' ),
        path.join( distFolderPath, 'src', 'library.module.d.ts' ),
        path.join( distFolderPath, 'src', 'data', 'data.service.d.ts' ),
        path.join( distFolderPath, 'src', 'input', 'input.component.d.ts' ),
    ];

    it( 'should exist for the entry', async() => {

        let fileContent: string;
        let currentError: Error | null = null;
        try {
            fileContent = fs.readFileSync( entryFilePath, 'utf-8' );
        } catch ( error ) {
            currentError = error;
        }

        expect( currentError ).toBeNull();
        expect( fileContent.length ).toBeGreaterThan( 0 );

    } );

    it( 'should exist for every single file', async () => {

        let fileContents: Array<string>;
        let currentError: Error | null = null;
        try {
            fileContents = await moduleFilePaths.map( ( path: string ): string => {
                return fs.readFileSync( path, 'utf-8' );
            } );
        } catch ( error ) {
            currentError = error;
        }

        expect( currentError ).toBeNull();

        fileContents.forEach( ( fileContent: string ): void => {
            expect( fileContent.length ).toBeGreaterThan( 0 );
        } );

    } );

} );
