import { copy } from 'cpx';

/**
 * Copy a file or a folder, based on the given pattern
 *
 * @param   sourcePattern  Pattern (glob) for the source
 * @param   desinationPath Path to the destination folder
 * @returns                Promise, resolves when done
 */
export function copyFiles( sourcePattern: string, destinationPath: string ): Promise<void> {
	return new Promise<void>( ( resolve: () => void, reject: ( error: Error ) => void ): void => {

		copy( sourcePattern, destinationPath, ( copyFilesError: Error | null ): void => {
			if ( copyFilesError ) {
				reject( new Error( `An error occured while copying everything matching "${ sourcePattern }" to "${ destinationPath }". [${ copyFilesError.message }]` ) );
				return;
			}
			resolve();
		} );

	} );
}
