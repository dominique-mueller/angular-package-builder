import * as path from 'path';

/**
 * Resolve path
 *
 * @param   filePath - File path
 * @returns          - Resolved path
 */
export function resolvePath( filePath: string ): string {
	return path.resolve( process.cwd(), filePath );
}
