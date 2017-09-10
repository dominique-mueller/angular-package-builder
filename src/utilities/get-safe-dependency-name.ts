import * as parsePackageJsonName from 'parse-packagejson-name';

/**
 * Get safe dependenc name
 *
 * @param   originalDependencyName - Original package name
 * @returns                        - Safe pakage name
 */
export function getSafeDependencyName( originalDependencyName: string ): string {

	// Parse package name
	const parsedDependencyName: any = parsePackageJsonName( originalDependencyName );

	// Get scope
	const scope: string = parsedDependencyName.scope === null
		? ''
		: `${ parsedDependencyName.scope }.`; // Dot as divider

	// Get name
	const name: string = parsedDependencyName.fullName

		// Convert hyphenated case into camel case
		.replace( /-([a-z])/g, ( value: string ) => {
			return value[ 1 ].toUpperCase();
		} )

		// Remove unsafe characters
		.replace( /[^A-Za-z]/g, '' );

	// Return safe dependency name
	return `${ scope }${ name }`;

}
