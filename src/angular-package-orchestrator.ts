import { AngularPackage } from './angular-package';

/**
 * Angular Package Orchestrator
 */
export class AngularPackageOrchestrator {

    /**
     * Orchestrate Angular Packages Build
     *
     * @param   angularPackages Angular Packages
     * @returns                 Angular Packages build orchestration
     */
	public static orchestrateAngularPackagesBuild( angularPackages: Array<Array<AngularPackage>> ): Array<Array<Array<Array<AngularPackage>>>> {

		// Order the angular packages (primary incl. secondary entry points)
		// by analyzing cross-dependencies
		const angularPackageBuilds: Array<Array<Array<AngularPackage>>> = this.findBuildOrderForAngularPackagesWithSubPackages( angularPackages );

		// For each angular package (primary incl. secondary entry points), order the internal angular packages build order
		// by analyzing cross-imports
		const angularPackageAndSubPackageBuilds: Array<Array<Array<Array<AngularPackage>>>> =
			angularPackageBuilds.map( ( angularPackagesOrdered: Array<Array<AngularPackage>> ): Array<Array<Array<AngularPackage>>> => {
				return angularPackagesOrdered.map( ( angularPackageOrdered: Array<AngularPackage> ): Array<Array<AngularPackage>> => {
					return this.findBuildOrderForAngularPackages( angularPackageOrdered );
				} );
			} );

		return angularPackageAndSubPackageBuilds;

    }

	/**
	 * Discover the build steps for a list of angular packages (between libraries), in the correct order based on the dependency definitions
	 *
	 * Example result:
	 * // Build steps, ordered
	 * [
	 *   // First build step
	 *   [
	 *     // Packages, could be built in parallel
	 *     [
	 *       "Package 1, primary entry",
	 *       "Package 1, secondary entry 1"
	 *     ],
	 *     [
	 *       "Package 3, primary entry"
	 *       "Package 3, secondary entry 1",
	 *       "Package 3, secondary entry 2",
	 *     ]
	 *   ],
	 *   // Second build step
	 *   [
	 *     // Packages, could be built in parallel
	 *     [
	 *       "Package 2, primary entry"
	 *     ]
	 *   ],
	 *   // ...
	 * ]
	 *
	 * @param   angularPackages List of angular packages
	 * @returns                 List of angular packages, ordered within another array
	 */
	private static findBuildOrderForAngularPackagesWithSubPackages( angularPackages: Array<Array<AngularPackage>> ): Array<Array<Array<AngularPackage>>> {

		// Get package names (primary only)
		const angularPackageNames: Array<string> = angularPackages
			.map( ( angularPackages ): string => {
				return angularPackages[ 0 ].packageName; // Primary package name
			} );

		// Find out build order (resursive)
		let angularPackagesNotYetInBuilds: Array<Array<AngularPackage>> = angularPackages;
		const angularPackageNamesAlreadyInBuilds: Array<string> = [];
		const builds: Array<Array<Array<AngularPackage>>> = [];
		while ( angularPackagesNotYetInBuilds.length !== 0 ) {

			// Filter out angular packages which are ready to be built
			const angularPackagesForNextBuild: Array<Array<AngularPackage>> = [];
			angularPackagesNotYetInBuilds = angularPackagesNotYetInBuilds
				.filter( ( angularPackage: Array<AngularPackage> ): boolean => {

					// Find local dependencies
					const angularPackageDependenciesNotYetInBuilds: Array<string> = Object
						.keys( angularPackage[ 0 ].dependencies )
						.filter( ( dependency: string ): boolean => {
							return angularPackageNames.indexOf( dependency ) !== -1;
						} )
						.filter( ( dependency: string ): boolean => {
							return angularPackageNamesAlreadyInBuilds.indexOf( dependency ) === -1;
						} );

					// If there are no local dependencies left to be added to the build, add itself to the build chain
					if ( angularPackageDependenciesNotYetInBuilds.length === 0 ) {
						angularPackagesForNextBuild.push( angularPackage );
						return false;
					} else {
						return true;
					}

				} );

			// Add new round of angular packages to the build chain
			builds.push( angularPackagesForNextBuild );
			const angularPackageNamesForNextBuild: Array<string> = angularPackagesForNextBuild
				.map( ( angularPackageReadyForBuild: Array<AngularPackage> ): string => {
					return angularPackageReadyForBuild[ 0 ].packageName;
				} );
			angularPackageNamesAlreadyInBuilds.push( ...angularPackageNamesForNextBuild );

		}

		return builds;

	}

	/**
	 * Discover the build steps for angular packages (within library), in the correct order based on the dependency definitions
	 *
	 * Example result:
	 * // Build steps, ordered
	 * [
	 *   // First build step
	 *   [
	 *     // Packages, could be built in parallel
	 *     [
	 *       "Package 1, primary entry",
	 *     ],
	 *     [
	 *       "Package 1, secondary entry 1",
	 *       "Package 1, secondary entry 2"
	 *     ]
	 *   ],
	 *   // Second build step
	 *   [
	 *     // Packages, could be built in parallel
	 *     [
	 *       "Package 2, primary entry"
	 *     ]
	 *   ],
	 *   // ...
	 * ]
	 *
	 * @param   angularPackages List of angular packages
	 * @returns                 List of angular packages, ordered within another array
	 */
	private static findBuildOrderForAngularPackages( angularPackages: Array<AngularPackage> ): Array<Array<AngularPackage>> {

		// Get package names
		const angularPackageNames: Array<string> = angularPackages
			.map( ( angularPackages ): string => {
				return angularPackages.packageName;
			} );

		let angularPackagesNotYetInBuilds: Array<AngularPackage> = angularPackages;
		const externalImportSourcesAlreadyInBuilds: Array<string> = [];
		const builds: Array<Array<AngularPackage>> = [];
		while ( angularPackagesNotYetInBuilds.length !== 0 ) {

			// Filter out angular packages which are ready to be built
			const angularPackagesForNextBuild: Array<AngularPackage> = [];
			angularPackagesNotYetInBuilds = angularPackagesNotYetInBuilds
				.filter( ( angularPackage: AngularPackage ): boolean => {

					// Find local import sources
					const externalImportSourcesNotYetInBuilds: Array<string> = angularPackage.externalImportSources
						.filter( ( externalImportSource: string ): boolean => {
							return angularPackageNames.indexOf( externalImportSource ) !== -1;
						} )
						.filter( ( externalImportSource: string ): boolean => {
							return externalImportSourcesAlreadyInBuilds.indexOf( externalImportSource ) === -1;
						} );

					// If there are no local import sources left to be added to the build, add itself to the build chain
					if ( externalImportSourcesNotYetInBuilds.length === 0 ) {
						angularPackagesForNextBuild.push( angularPackage );
						return false;
					} else {
						return true;
					}

				} );

			// Add new round of angular packages to the build chain
			builds.push( angularPackagesForNextBuild );
			const packageNamesReadyForBuild: Array<string> = angularPackagesForNextBuild
				.map( ( angularPackageReadyForBuild: AngularPackage ): string => {
					return angularPackageReadyForBuild.packageName;
				} );
			externalImportSourcesAlreadyInBuilds.push( ...packageNamesReadyForBuild );

		}

		return builds;
	}

}
