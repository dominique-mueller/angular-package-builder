import { posix as path } from 'path';

import * as typescript from 'typescript';
import Project, { SourceFile } from 'ts-simple-ast';

import { AngularPackageConfig } from './config.interface';
import { readFile } from './utilities/read-file';
import { getDependencyMap } from './utilities/get-dependency-map';
import { deduplicateArray } from './utilities/deduplicate-array';
import { AngularImportFileAnalyzer } from './transformer/imports/angular-import.file-analyzer';

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

    public async withConfig( absoluteAngularPackageJsonPath: string ): Promise<void> {

        this.cwd = path.dirname( absoluteAngularPackageJsonPath );

        // Read files
        // TODO: Error handling
        const angularPackageJson: AngularPackageConfig = await readFile( absoluteAngularPackageJsonPath );
        const absolutePackageJsonPath: string = path.join( this.cwd, 'package.json' );
        const packageJson: any = await readFile( absolutePackageJsonPath );

        // Get primary entry information
        this.entryFile = path.normalize( angularPackageJson.entryFile );
        this.outDir = path.normalize( angularPackageJson.outDir );
        this.packageName = packageJson.name;

        // Get secondary entry information
        // this.secondaryEntries = ( angularPackageJson.secondaryEntries || [] )
        //     .map( ( secondaryEntry: AngularSubPackageConfig ): AngularPackageConfigInternal => {
        //         const entryFile: string = path.normalize( secondaryEntry.entryFile );
        //         const relativeEntryDir: string = path.relative( path.dirname( this.entry.entryFile ), path.dirname( entryFile ) );
        //         const outDir: string = path.join( this.entry.outDir, relativeEntryDir );
        //         const packageName: string = [ this.entry.packageName, relativeEntryDir ].join( '/' );
        //         const fileName: string = packageName.split( '/' ).pop();
        //         return { entryFile, fileName, outDir, packageName };
        //     } );

        // Get compiler options
        this.typescriptCompilerOptions = angularPackageJson.typescriptCompilerOptions || {};
        this.angularCompilerOptions = angularPackageJson.angularCompilerOptions || {};

        // Get dependencies
        const dependencies: Array<string> = [
            ...Object.keys( packageJson.dependencies || {} ),
            ...Object.keys( packageJson.peerDependencies || {} )
        ];
        this.dependencies = getDependencyMap( deduplicateArray( dependencies ) );

        // Create TypeScript project
        this.typescriptProject = this.createTypeScriptProject();
        this.externalImportSources = this.discoverExternalImportSources( this.typescriptProject );

    }

    /**
     * Create TypeScript project
     *
     * @returns TypeScript project
     */
    private createTypeScriptProject(): Project {

        // Create TypeScript program; this also resolves all referenced modules and typings (both internal and external)
        const entryFilePath: string = path.join( this.cwd, this.entryFile );
        const typescriptProgram: typescript.Program = typescript.createProgram( [ entryFilePath ], {} );

        // Get all source file paths, but exclude external modules & typings
        const sourceFilePaths: Array<string> = typescriptProgram.getSourceFiles()
            .filter( ( sourceFile: typescript.SourceFile ): boolean => {
                return !typescriptProgram.isSourceFileFromExternalLibrary( sourceFile ) && !sourceFile.isDeclarationFile;;
            } )
            .map( ( sourceFile: typescript.SourceFile ): string => {
                return sourceFile.fileName; // This is actually the path ... weird, right?
            } );

        // Create TypeScript project
        const typescriptProject: Project = new Project();
        typescriptProject.addExistingSourceFiles( sourceFilePaths );

        return typescriptProject;

    }

    /**
     * Discover external import sources
     *
     * @param   typescriptProject TypeScript project (including source files)
     * @returns                   List of external import sources
     */
    private discoverExternalImportSources( typescriptProject: Project ): Array<string> {

        // Analyze source files for external imports
        const externalImportSources: Array<string> = typescriptProject.getSourceFiles()
            .reduce( ( externalImports: Array<string>, sourceFile: SourceFile ): Array<string> => {
                return [
                    ...externalImports,
                    ...AngularImportFileAnalyzer.getExternalImportSources( sourceFile ),
                ];
            }, [] );

        // Remove duplicate external imports
        const externalImportSourcesDeduplicated: Array<string> = deduplicateArray( externalImportSources );

        return externalImportSourcesDeduplicated;

    }

}
