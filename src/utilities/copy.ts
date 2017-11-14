import * as path from 'path';

import * as cpx from 'cpx';

/**
 * Copy a file or a folder (recursively)
 *
 * @param   sourcePattern  - Pattern (glob) for the source
 * @param   desinationPath - Path to the destination folder
 * @returns                - Promise, resolves with File content (parsed if JSON)
 */
export function copy( sourcePattern: string, destinationPath: string ): Promise<void> {
	return new Promise<void>( ( resolve: () => void, reject: ( error: Error ) => void ): void => {

		// Copy asynchronously
		cpx.copy( sourcePattern, destinationPath, ( copyFileError: Error | null ): void => {
			if ( copyFileError ) {
				reject( new Error( `An error occured while copying everything matching "${ sourcePattern }" to "${ destinationPath }". [${ copyFileError.message }]` ) );
				return;
			}
			resolve();
		} );

	} );
}
