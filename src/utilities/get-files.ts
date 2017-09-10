import * as path from 'path';

import * as globby from 'globby';

/**
 * Get list of files by pattern
 *
 * @param   patterns              - List of patterns
 * @param   basePath              - Base path (absolute)
 * @param   [absolutePaths=false] - Flag, describing whether the returned lis of files should contain relative or absolute paths
 * @returns                       - List of files (empty list of none was found)
 */
export function getFiles( patterns: Array<string>, basePath: string, absolutePaths: boolean = false ): Promise<Array<string>> {
	return new Promise<Array<string>>( async( resolve: ( files: Array<string> ) => void, reject: ( error: Error ) => void ) => {

		// Get files, using the entry folder as base (so we can easily keep the directory structure in the dist folder)
		let files: Array<string> = await globby( patterns, {
			cwd: basePath
		} );

		// Convert relative into absolute paths (if wanted)
		if ( absolutePaths ) {
			files = files.map( ( file: string ): string => {
				return path.join( basePath, file );
			} );
		}

		resolve( files );

	} );
}
