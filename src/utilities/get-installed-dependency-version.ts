/**
 * Get installed dependency version
 *
 * @param   dependencyName - Dependency name
 * @returns                - Promise, resolving with dependency version
 */
export async function getInstalledDependencyVersion( dependencyName: string ): Promise<string> {
	return ( await import( `${ dependencyName }/package.json` ) ).version;
}
