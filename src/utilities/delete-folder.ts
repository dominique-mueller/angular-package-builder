import * as path from 'path';

import * as del from 'del';

/**
 * Delete a folder (meaning the folder itself plus all its children)
 *
 * @param   folderPath - Path to the folder
 * @returns            - Promise, resolves with File content (parsed if JSON)
 */
export function deleteFolder( folderPath: string ): Promise<void> {
	return del( [ path.join( folderPath, '**' ) ] );
}
