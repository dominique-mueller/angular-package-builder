import * as parsePackageJsonName from 'parse-packagejson-name';

/**
 * Get safe package name
 *
 * @param   originalPackageName - Original package name
 * @returns                     - Safe pakage name
 */
export function getSafePackageName( originalPackageName: string ): string {

	return parsePackageJsonName( originalPackageName ).fullName
		.replace( /[^A-Za-z-]/g, '-' ) // Replace unsafe characters with a hyphen
		.replace( /^\-+|\-+$/g, '' ) // Remove hyphens at beginning and end of package name
		.toLowerCase(); // Convert to lowercase (just to be sure)

}
