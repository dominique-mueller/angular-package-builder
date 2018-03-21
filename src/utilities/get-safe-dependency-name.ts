/**
 * Get safe dependenc name
 *
 * @param   originalDependencyName - Original package name
 * @returns                        - Safe pakage name
 */
export function getSafeDependencyName( originalDependencyName: string ): string {
	return originalDependencyName
		.replace( '@', '' ) // Remove scope identifier (can only appear once at the start)
		.replace( /\//g, '.' ) // Replaces slashes with dots (between scope and name, or further on in the name)+
		.replace( /-([a-z])/g, ( value: string ): string => { // Convert hyphenated case into camel case
			return value[ 1 ].toUpperCase();
		} )
		.replace( /[^A-Za-z\.]/g, '' ); // Remove any unsafe characters (other than dots)
}
