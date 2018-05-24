/**
 * Get thr installed version of the given dependency
 *
 * @param   dependencyName Dependency (module) name
 * @returns                Promise, resolving with dependency version
 */
export async function getInstalledDependencyVersion( dependencyName: string ): Promise<string> {
	return ( await import( `${ dependencyName }/package.json` ) ).version;
}
