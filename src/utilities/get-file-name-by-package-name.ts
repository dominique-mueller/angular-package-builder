/**
 * Get file name by package name
 *
 * @param   packageName Package name
 * @returns             File name
 */
export function getFileNameByPackageName( packageName: string ): string {
    return packageName
        .split( '/' )
        .pop();
}
