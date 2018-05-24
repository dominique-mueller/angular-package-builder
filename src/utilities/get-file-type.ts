import { posix as path } from 'path';

/**
 * Get the type of a file
 *
 * @param   filePath Path to the file
 * @returns          File type
 */
export function getFileType( filePath: string ): string {
    return path
        .extname( filePath ) // Get file extension
        .substring( 1 ) // Remove the dot
        .toLowerCase(); // Convert to lower-case for consistency
}
