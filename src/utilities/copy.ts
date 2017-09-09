import * as path from 'path';

import * as cpx from 'cpx';

/**
 * Copy a file or a folder (recursively)
 *
 * @param   sourceGlob     - Glob for the source
 * @param   desinationPath - Path to the destination folder
 * @returns                - Promise, resolves with File content (parsed if JSON)
 */
export function copy( sourceGlob: string, destinationPath: string ): Promise<void> {
	return new Promise<void>( ( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Copy asynchronously
		cpx.copy( sourceGlob, destinationPath, ( copyFileError: Error | null ) => {

			// Handle errors
			if ( copyFileError ) {
				reject( new Error( `An error occured while copying everything matching "${ sourceGlob }" to "${ destinationPath }". [${ copyFileError.message }]` ) );
				return;
			}

			resolve();

		} );

	} );
}
