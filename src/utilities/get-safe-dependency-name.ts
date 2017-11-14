import * as parsePackageJsonName from 'parse-packagejson-name';

/**
 * Get safe dependenc name
 *
 * @param   originalDependencyName - Original package name
 * @returns                        - Safe pakage name
 */
export function getSafeDependencyName( originalDependencyName: string ): string {

	// Parse package name
	const { scope, fullName, projectName, moduleName }: any = parsePackageJsonName( originalDependencyName );

	// Get safe name
	const safeFullName: string = fullName
		.replace( /-([a-z])/g, ( value: string ): string => { // Convert hyphenated case into camel case
			return value[ 1 ].toUpperCase();
		} )
		.replace( /[^A-Za-z]/g, '' ); // Remove unsafe characters

	// Return safe dependency name
	return scope ? `${ scope }.${ safeFullName }` : safeFullName;

}
