import { posix as path } from 'path';

import { AngularPackage } from './src/angular-package';
import { AngularPackageReader } from './src/angular-package-reader';
import { AngularPackageOrchestrator } from './src/angular-package-orchestrator';
import { AngularPackageBuilder } from './src/angular-package-builder';
import { flattenArray } from './src/utilities/flatten-array';

/**
 * Run Angular Package Builder
 */
export async function runAngularPackageBuilder( angularPackageJsonPaths: Array<string> ): Promise<void> {

	// Create Angular package definitions for each angular package json file
	const angularPackages: Array<Array<AngularPackage>> = await AngularPackageReader.readAngularPackageJsonFiles( angularPackageJsonPaths );

	// Orchestrate the build
	const buildOrchestration: Array<Array<Array<Array<AngularPackage>>>> = AngularPackageOrchestrator.orchestrateAngularPackagesBuild( angularPackages );

	// Flatten (sequential builds)
	const flattenedBuildOrchestration: Array<AngularPackage> = flattenArray( buildOrchestration );

	// RUN!
	const builtAngularPackages: any = {};
	for ( const angularPackage of flattenedBuildOrchestration ) {
		angularPackage.addCustomModulePaths( builtAngularPackages );
		await AngularPackageBuilder.package( angularPackage );
		builtAngularPackages[ angularPackage.packageName ] = [
			path.join( angularPackage.root, angularPackage.outDir )
		];
	}

}

runAngularPackageBuilder( [
	'./test/my-library/.angular-package.json',
	'./test/my-second-library/.angular-package.json',
] );
