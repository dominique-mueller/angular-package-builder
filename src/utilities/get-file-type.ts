import { posix as path } from 'path';

/**
 * Get the type of a file
 *
 * @param   filePath - Path to the file
 * @returns          - File type
 */
export function getFileType( filePath: string ): string {
    return path.extname( filePath )
        .substring( 1 ) // Without the dot
        .toLowerCase(); // For consistency
}
