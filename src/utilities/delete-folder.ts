import * as path from 'path';

import * as del from 'del';

/**
 * Delete a folder
 *
 * @param   folderPath - Path to the folder
 * @returns            - Promise, resolves with File content (parsed if JSON)
 */
export function deleteFolder( folderPath: string ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Delete the folder (deletes the folder itself including all children)
		await del( [ path.join( folderPath, '**' ) ] );

		resolve();

	} );
}
