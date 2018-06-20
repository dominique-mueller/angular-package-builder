import { posix as path } from 'path';

import { AngularPackage } from './src/angular-package';
import { AngularPackageReader } from './src/angular-package-reader';
import { AngularPackageOrchestrator } from './src/angular-package-orchestrator';
import { AngularPackageBuilder } from './src/angular-package-builder';
import { flattenArray } from './src/utilities/flatten-array';
import { AngularPackageLogger } from './src/logger/angular-package-logger';
import { AngularPackageCompatibilityChecker } from './src/angular-package-compatibility-checker';

/**
 * Run Angular Package Builder
 */
export async function runAngularPackageBuilder( angularPackageJsonPaths: Array<string> ): Promise<void> {

	AngularPackageLogger.logTitle( 'Angular Package Builder' );

	// Check versions
	try {
		await AngularPackageCompatibilityChecker.checkCompatibility();
	} catch ( error ) {
		AngularPackageLogger.logPreparationMessage( error.message, 'warning' );
	}

	// Create Angular package definitions for each angular package json file
	let angularPackages: Array<Array<AngularPackage>>;
	try {
		angularPackages = await AngularPackageReader.readAngularPackageJsonFiles( angularPackageJsonPaths );
	} catch ( error ) {
		AngularPackageLogger.logPreparationMessage( error.message, 'error' );
		throw new Error( error.message );
	}

	// Derive build orchestration
	let buildOrchestration: Array<Array<Array<Array<AngularPackage>>>>;
	try {
		buildOrchestration = AngularPackageOrchestrator.orchestrateAngularPackagesBuild( angularPackages );
	} catch ( error ) {
		AngularPackageLogger.logPreparationMessage( error.message, 'error' );
		throw new Error( error.message );
	}
	const flattenedBuildOrchestration: Array<AngularPackage> = flattenArray( buildOrchestration );

	// Execute builds
	AngularPackageLogger.configureNumberOfBuildSteps( flattenedBuildOrchestration.length );
	const builtAngularPackages: { [ packageName: string ]: Array<string> } = {};
	for ( const angularPackage of flattenedBuildOrchestration ) {

		AngularPackageLogger.logBuildStart( angularPackage.packageName );

		// Configure already built packages
		angularPackage.addCustomModulePaths( builtAngularPackages );

		// Create package
		try {
			await AngularPackageBuilder.package( angularPackage );
		} catch ( error ) {
			AngularPackageLogger.logBuildError();
			throw new Error( error.message ); // Bubble up
		}

		// Add package to already built packages
		builtAngularPackages[ angularPackage.packageName ] = [
			path.join( angularPackage.root, angularPackage.outDir )
		];

		AngularPackageLogger.logBuildSuccess();

	}

}
