import * as path from 'path';

import Project from 'ts-simple-ast';

import { AngularPackageOptions } from './angular-package-config.interface';
import { readFile } from './utilities/read-file';
import { ImportAnalyzer } from './analyzer/import.analyzer';
import { createTypescriptProject } from './utilities/create-typescript-project';

/**
 * Angular Package
 */
export class AngularPackage {

	/**
	 * Angular Package project directory
	 */
    public cwd: string;

    /**
     * Entry file path (relative to cwd)
     */
    public entryFile: string;

    /**
     * Output directory path (relative to cwd)
     */
    public outDir: string;

    /**
     * Package name
     */
    public packageName: string;

	/**
	 * Custom TypeScript compiler options
	 */
    public typescriptCompilerOptions: { [ option: string ]: any };

	/**
	 * Custom Angular compiler options
	 */
    public angularCompilerOptions: { [ option: string ]: any };

    /**
     * Dependencies (name -> id)
     */
    public dependencies: { [ dependency: string ]: string };

    /**
     * List of external import sources
     */
    public externalImportSources: Array<string>;

    /**
     * TypeScript project
     */
    public typescriptProject: Project;

    public async withConfig( cwd: string, angularPackageOptions: AngularPackageOptions ): Promise<void> {

        this.cwd = cwd;

        // Read files
        const absolutePackageJsonPath: string = path.join( this.cwd, 'package.json' );
        const packageJson: any = await readFile( absolutePackageJsonPath );

        // Get primary entry information
        this.entryFile = path.normalize( angularPackageOptions.entryFile );
        this.outDir = path.join( angularPackageOptions.outDir, path.dirname( angularPackageOptions.entryFile ) );
        this.packageName = path.join( packageJson.name, path.dirname( angularPackageOptions.entryFile ) );

        // Get compiler options
        this.typescriptCompilerOptions = angularPackageOptions.typescriptCompilerOptions || {};
        this.angularCompilerOptions = angularPackageOptions.angularCompilerOptions || {};

        // Get dependencies
        const packageDependencies: { [ dependency: string ]: string } = [
            ...Object.keys( packageJson.dependencies || {} ),
            ...Object.keys( packageJson.devDependencies || {} ),
            ...Object.keys( packageJson.optionalDependencies || {} ),
            ...Object.keys( packageJson.peerDependencies || {} )
        ]
            .reduce( ( dependencyMap: { [ dependency: string ]: string }, dependency: string ): { [ dependency: string ]: string } => {
                dependencyMap[ dependency ] = ''; // This also de-duplicates the array! Fancy!
                return dependencyMap;
            }, {} );
        this.dependencies = {
            ...( angularPackageOptions.dependencies || {} ),
            ...packageDependencies
        };

        // Create TypeScript project
        this.typescriptProject = createTypescriptProject( path.join( this.cwd, this.entryFile ) );
        this.externalImportSources = ImportAnalyzer.getExternalImportSources( this.typescriptProject );

    }

    public addPaths( packageNameWithPaths: { [ packageName: string ]: Array<string> } ): void {
        this.typescriptCompilerOptions.paths = {
            ...( this.typescriptCompilerOptions.paths || {} ),
            ...packageNameWithPaths
        };
    }

}
