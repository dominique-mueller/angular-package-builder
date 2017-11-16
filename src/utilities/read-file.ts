import * as fs from 'fs';
import { posix as path } from 'path';

/**
 * Read a file
 *
 * @param   filePath - Path to the file
 * @returns          - Promise, resolves with File content (parsed if JSON)
 */
export function readFile( filePath: string ): Promise<string | any> {
	return new Promise<string | any>( ( resolve: ( fileContent: string ) => void, reject: ( error: Error ) => void ) => {

		// Read file asynchronously
		fs.readFile( filePath, 'utf-8', ( readFileError: NodeJS.ErrnoException | null, fileContent: string ) => {

			// Handle errors
			if ( readFileError ) {
				reject( new Error( `An error occured while reading the file "${ filePath }". [Code "${ readFileError.code }", Number "${ readFileError.errno }"]` ) );
				return;
			}

			// Automatically parse JSON files into JavaScript objects
			let parsedFileContent: string | any = fileContent;
			if ( path.extname( filePath ).replace( '.', '' ).toLowerCase() === 'json' ) {

				// Safely try to parse the file as JSON
				try {
					parsedFileContent = JSON.parse( fileContent );
				} catch ( jsonParseError ) {
					reject( new Error( `An error occured while parsing the file "${ filePath }" as JSON. [${ ( <Error> jsonParseError ).message }]` ) );
					return;
				}

			}

			resolve( parsedFileContent );

		} );

	} );
}
