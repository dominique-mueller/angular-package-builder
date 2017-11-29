import { posix as path } from 'path';

import * as semver from 'semver';

import { Logger } from '../logger/logger';

/**
 * Ensure a specific version of a dependency
 *
 * @param dependency      - Name of / path to the dependency
 * @param requiredVersion - Required version or version range
 */
export async function ensureDependencyVersion( dependency: string, requiredVersion: string ): Promise<void> {

	// Get dependency version
	let installedDependencyVersion: string;
	try {
		installedDependencyVersion = ( await import( path.join( dependency, 'package.json' ) ) ).version;
	} catch ( error ) {
		throw new Error( [
			`The package "${ dependency }" does not seem to be installed, or the installation is broken.`,
			`Make sure that "${ dependency }" is listed in your dependencies, perhaps re-install them ...`,
			error.message
		].join( '\n' ) );
	}

	// Version check
	if ( !semver.satisfies( installedDependencyVersion, requiredVersion ) ) {
		Logger.warn( [
			`Version "${ installedDependencyVersion }" of "${ dependency }" is not supported by the Angular Package Builder.`,
			`The dependency is expected to satisfy "${ requiredVersion }". Will try to continue anyway ...`
		].join( '\n' ) );
	}

}
