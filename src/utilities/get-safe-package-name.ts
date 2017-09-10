import * as parsePackageJsonName from 'parse-packagejson-name';

/**
 * Get safe package name
 *
 * @param   originalPackageName - Original package name
 * @returns                     - Safe pakage name
 */
export function getSafePackageName( originalPackageName: string ): string {

	// Parse package name
	return parsePackageJsonName( originalPackageName ).fullName

		// Replace unsafe characters with a hyphen
		.replace( /[^A-Za-z-]/g, '-' )

		// Remove hyphens at beginning and end of package name
		.replace( /^\-+|\-+$/g, '' )

		// Convert to lowercase (just to be sure)
		.toLowerCase();

}
