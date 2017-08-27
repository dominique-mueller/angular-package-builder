import * as fs from 'fs';
import * as path from 'path';

import { resolvePath } from './resolve-path';

/**
 * Read a file
 *
 * @param   filePath                - Path to the file
 * @returns                         - Promise, resolves with File content (parsed if JSON)
 */
export function readFile( filePath: string ): Promise<string> {
	return new Promise<string>( ( resolve: ( fileContent: string ) => void, reject: ( error: Error ) => void ) => {

		// Resolve file path to an absolute one
		const resolvedFilePath: string = resolvePath( filePath );

		// Read file asynchronously
		fs.readFile( resolvedFilePath, 'utf-8', ( readFileError: NodeJS.ErrnoException | null, fileContent: string ) => {

			// Handle errors
			if ( readFileError ) {
				reject( new Error( `An error occured while reading the file "${ resolvedFilePath }". [Code "${ readFileError.code }", Number "${ readFileError.errno }"]` ) );
				return;
			}

			resolve( fileContent );

		} );

	} );
}
