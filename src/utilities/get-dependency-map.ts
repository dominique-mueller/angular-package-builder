import { getSafeDependencyName } from '../utilities/get-safe-dependency-name';
import { angularDependencies } from '../bundler/dependencies/angular.dependencies';
import { rxjsDependencies } from '../bundler/dependencies/rxjs.dependencies';

/**
 * Get full dependency map
 */
export function getDependencyMap( dependencies: Array<string> ): { [ dependency: string ]: string } {

	const customDependencies: { [ dependency: string ]: string } = dependencies

		// Filter out Angular and RxJS dependencies (as we have already covered those)
		.filter( ( dependency: string ): boolean => {
			return !dependency.startsWith( '@angular/' ) && dependency !== 'rxjs';
		} )

		// Create the package to name map
		.reduce( ( dependencies: { [ dependency: string ]: string }, dependency: string): { [ dependencies: string ]: string } => {
			dependencies[ dependency ] = getSafeDependencyName( dependency );
			return dependencies;
		}, {} );

	// Let custom dependencies overwrite pre-defined ones
	return Object.assign( angularDependencies, rxjsDependencies, customDependencies );

}
