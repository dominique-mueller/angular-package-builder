import { posix as path } from 'path';

import chalk from 'chalk';

import { AngularPackage } from './src/angular-package';
import { AngularPackageReader } from './src/angular-package-reader';
import { AngularPackageOrchestrator } from './src/angular-package-orchestrator';
import { AngularPackageBuilder } from './src/angular-package-builder';
import { flattenArray } from './src/utilities/flatten-array';
import { AngularPackageLogger } from './src/logger/angular-package-logger';

/**
 * Run Angular Package Builder
 */
export async function runAngularPackageBuilder( angularPackageJsonPaths: Array<string> ): Promise<void> {

	AngularPackageLogger.logTitle( 'Angular Package Builder' );

	// Create Angular package definitions for each angular package json file
	const angularPackages: Array<Array<AngularPackage>> = await AngularPackageReader.readAngularPackageJsonFiles( angularPackageJsonPaths );
	const buildOrchestration: Array<Array<Array<Array<AngularPackage>>>> = AngularPackageOrchestrator.orchestrateAngularPackagesBuild( angularPackages );
	const flattenedBuildOrchestration: Array<AngularPackage> = flattenArray( buildOrchestration );
	AngularPackageLogger.configureNumberOfAngularPackages( flattenedBuildOrchestration.length );

	// RUN!
	const builtAngularPackages: any = {};
	for ( const angularPackage of flattenedBuildOrchestration ) {

		AngularPackageLogger.logBuildStart( angularPackage.packageName );

		angularPackage.addCustomModulePaths( builtAngularPackages );
		await AngularPackageBuilder.package( angularPackage );
		builtAngularPackages[ angularPackage.packageName ] = [
			path.join( angularPackage.root, angularPackage.outDir )
		];

		AngularPackageLogger.logBuildSuccess();

	}

	console.log( '' );

}

runAngularPackageBuilder( [
	'./test/my-library/.angular-package.json',
	'./test/my-second-library/.angular-package.json',
] );
