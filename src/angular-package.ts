import { posix as path } from 'path';

import Project from 'ts-simple-ast';

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
    public root: string;

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
     * Flag, describing whether the trny is primary (true) or secondary (false)
     */
    public isPrimary: boolean;

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

    public setRoot( root: string ): AngularPackage {
        this.root = root;
        return this;
    }

    public setEntryFileAndOutDir( entryFile: string, outDir: string ): AngularPackage {
        this.entryFile = path.normalize( entryFile );
        this.outDir = path.join( outDir, path.dirname( entryFile ) );
        return this;
    }

    public setTypescriptCompilerOptions( typescriptCompilerOptions: { [ options: string ]: any } ): AngularPackage {
        this.typescriptCompilerOptions = typescriptCompilerOptions;
        return this;
    }

    public setAngularCompilerOptions( angularCompilerOptions: { [ options: string ]: any } ): AngularPackage {
        this.angularCompilerOptions = angularCompilerOptions;
        return this;
    }

    public setDependencies( customDependencies: { [ dependency: string ]: string } ): AngularPackage {
        this.dependencies = customDependencies;
        return this;
    }

    public asPrimaryEntry(): AngularPackage {
        this.isPrimary = true;
        return this;
    }

    public asSecondaryEntry(): AngularPackage {
        this.isPrimary = false;
        return this;
    }

    public async init(): Promise<AngularPackage> {

        // Read package json file
        const absolutePackageJsonPath: string = path.join( this.root, 'package.json' );
        const packageJson: any = await readFile( absolutePackageJsonPath );

        // Set package name
        this.packageName = path.join( packageJson.name, this.isPrimary ? '' : path.dirname( this.entryFile ) );

        // Extend dependencies
        const packageDependencies: { [ dependency: string ]: string } = [
            ...Object.keys( packageJson.dependencies || {} ),
            ...Object.keys( packageJson.optionalDependencies || {} ),
            ...Object.keys( packageJson.peerDependencies || {} )
        ]
            .reduce( ( dependencyMap: { [ dependency: string ]: string }, dependency: string ): { [ dependency: string ]: string } => {
                dependencyMap[ dependency ] = ''; // This also de-duplicates the array! Fancy!
                return dependencyMap;
            }, {} );
        this.dependencies = {
            ...packageDependencies,
            ...this.dependencies // Priority!
        };

        // Create TypeScript project
        this.typescriptProject = createTypescriptProject( path.join( this.root, this.entryFile ) );
        this.externalImportSources = ImportAnalyzer.getExternalImportSources( this.typescriptProject );

        return this;

    }

    public addCustomModulePaths( moduleNameWithPaths: { [ moduleName: string ]: Array<string> } ): void {
        this.typescriptCompilerOptions.paths = {
            ...( this.typescriptCompilerOptions.paths || {} ),
            ...moduleNameWithPaths
        };
    }

}
