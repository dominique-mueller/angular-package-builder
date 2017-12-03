import { posix as path } from 'path';

import * as globby from 'globby';

/**
 * Get list of files by pattern
 *
 * @param   patterns - List of patterns
 * @param   basePath - Base path, makes the function return relative paths if set
 * @returns          - List of files (empty list of none was found)
 */
export async function getFiles( patterns: Array<string>, basePath: string = '' ): Promise<Array<string>> {

	return globby( patterns, {
		gitignore: true, // Respect ignored files & folders
		cwd: basePath
	} );

}
