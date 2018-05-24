import * as path from 'path';

import * as del from 'del';

/**
 * Delete a folder (meaning the folder itself and everything in it)
 *
 * @param   folderPath Path to the folder
 * @returns            Promise, resolves when done
 */
export async function deleteFolder( folderPath: string ): Promise<void> {
	await del( [ path.join( folderPath, '**' ) ] );
}
