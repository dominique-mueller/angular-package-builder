import { satisfies } from 'semver';

import { getInstalledDependencyVersion } from './utilities/get-installed-dependency-version';

/**
 * Angular Package Compatibility Checker
 */
export class AngularPackageCompatibilityChecker {

	/**
	 * Version matrix
	 */
	private static readonly versionMatrix: Array<AngularPackageCompatibilityInformation> = [
		{
			angular: '>= 4.0.0 < 5.0.0',
			typescript: '>= 2.1.0 < 2.4.0'
		},
		{
			angular: '>= 5.0.0 < 5.1.0',
			typescript: '>= 2.4.0 < 2.5.0'
		},
		{
			angular: '>= 5.1.0 < 5.2.0',
			typescript: '>= 2.4.0 < 2.6.0'
		},
		{
			angular: '>= 5.2.0 < 6.0.0',
			typescript: '>= 2.4.0 < 2.7.0'
		},
		{
			angular: '>= 6.0.0 < 6.1.0',
			typescript: '>= 2.7.0 < 2.8.0'
		}
	];

	public static async checkCompatibility(): Promise<void> {

		// Get versions of installed dependencies
		const angularVersion: string = await getInstalledDependencyVersion( '@angular/compiler-cli' );
		const typescriptVersion: string = await getInstalledDependencyVersion( 'typescript' );

		// Get correct item of the version matrix, based on installed version of Angular
		const compatibilityInformation: AngularPackageCompatibilityInformation | undefined = this.versionMatrix
			.find( ( versionMatrix: AngularPackageCompatibilityInformation ): boolean => {
				return satisfies( angularVersion, versionMatrix.angular );
			} );

		// Throw Angular version error
		if ( !compatibilityInformation ) {
			throw new Error( [
				`It seems that Angular is installed in version "${ angularVersion }".`,
				'',
				`Please not that this version is not officially supported by the Angular Package Builder.`,
				'A list of compatible Angular versions can be found here: https://github.com/dominique-mueller/angular-package-builder#requirements',
				'',
				'Trying to continue anyway ...'
			].join() );
		}

		// Throw TypeScript version error
		if ( !satisfies( typescriptVersion, compatibilityInformation.typescript ) ) {
			throw new Error( [
				`It seems that TypeScript is installed in version "${ typescriptVersion }".`,
				'',
				`Please not that this version is not officially compatible with the installed Angular version "${ angularVersion }", and thus supported by the Angular Package Builder.`,
				'A matrix of Angular-TypeScript compatibility can be found here: https://github.com/dominique-mueller/angular-package-builder#requirements',
				'',
				'Trying to continue anyway ...'
			].join() );
		}

	}

}

/**
 * Angular Package Compatibility Information Interface
 */
export interface AngularPackageCompatibilityInformation {
	angular: string;
	typescript: string;
};
