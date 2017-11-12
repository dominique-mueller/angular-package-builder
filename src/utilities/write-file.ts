import * as path from 'path';

import * as fsExtra from 'fs-extra';

/**
 * Write content into a file
 *
 * @param   filePath    - Path to the file
 * @param   fileContent - Content of the file
 * @returns             - Promise
 */
export function writeFile( filePath: string, fileContent: string | Object ): Promise<void> {
	return new Promise<void>( ( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Write file asynchronously; implicitely creates the file (and the directory) if necessary
		fsExtra.outputFile( filePath, fileContent, 'utf-8', ( writeFileError: NodeJS.ErrnoException | null ) => {
			if ( writeFileError ) {
				reject( new Error( `An error occured while writing the file "${ filePath }". [Code "${ writeFileError.code }", Number "${ writeFileError.errno }"]` ) );
				return;
			}
			resolve();

		} );

	} );
}
