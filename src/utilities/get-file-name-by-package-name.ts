/**
 * Get file name by package name
 *
 * The result is, essentially, the last part of the package.json name. For correct names, this would be the package name excluding the
 * package scope. For "incorrect" names (aka names with more than one slash), this would be the last segment (aka sub-module name).
 *
 * @param   packageName Package name
 * @returns             File name
 */
export function getFileNameByPackageName( packageName: string ): string {
    return packageName
        .split( '/' )
        .pop();
}
