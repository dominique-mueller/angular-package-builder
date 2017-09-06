import * as fsExtra from 'fs-extra';
import * as path from 'path';

/**
 * Clean a folder
 *
 * @param   folderPath - Path to the folder
 * @returns            - Promise, resolves with File content (parsed if JSON)
 */
export function cleanFolder( folderPath: string ): Promise<void> {
	return new Promise<void>( ( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Read file asynchronously
		fsExtra.emptyDir( folderPath, ( readFileError: NodeJS.ErrnoException | null, fileContent: string ) => {

			// Handle errors
			if ( readFileError ) {
				reject( new Error( `An error occured while cleaning the folder "${ folderPath }". [Code "${ readFileError.code }", Number "${ readFileError.errno }"]` ) );
				return;
			}

			resolve();

		} );

	} );
}
