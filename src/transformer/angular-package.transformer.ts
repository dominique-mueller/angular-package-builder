import { posix as path } from 'path';

import * as typescript from 'typescript';
import Project, { SourceFile } from 'ts-simple-ast';

import { deduplicateArray } from '../utilities/deduplicate-array';
import { AngularImportFileAnalyzer } from './angular-import.file-analyzer';
import { AngularExternalTemplate, AngularExternalStyles, AngularExternalResource } from './angular-external-resources-analyzer.interfaces';

/**
 * Angular Package Transformer
 */
export class AngularPackageTransformer {

    /**
     * Source files
     */
    public get sourceFiles(): Array<SourceFile> {
        return this.typescriptProject.getSourceFiles();
    };

    /**
     * Source files with paths
     */
    public get sourceFilesWithPaths(): { [ path: string ]: string } {
        return this.sourceFiles
            .reduce( ( files: { [ path: string ]: string }, sourceFile: SourceFile ): { [ path: string ]: string } => {
                files[ sourceFile.getFilePath() ] = sourceFile.getText();
                return files;
            }, {} );
    }

    /**
     * TypeScript project
     */
    private readonly typescriptProject: Project;

    /**
     * Constructor
     *
     * @param entryFilePath Path to the package entry file (e.g. 'index.ts' file)
     */
    constructor( entryFilePath: string ) {

        // Create TypeScript program, using the original TypeScript API to get the module resolution feature
        const absoluteEntryFilePath: string = path.resolve( entryFilePath );
        const typescriptProgram: typescript.Program = typescript.createProgram( [ absoluteEntryFilePath ], {} );

        // Get all source file paths, excluding all external libraries & typing files
        const absoluteSourceFilePaths: Array<string> = typescriptProgram.getSourceFiles()
            .filter( ( sourceFile: typescript.SourceFile ): boolean => {
                return !typescriptProgram.isSourceFileFromExternalLibrary( sourceFile ) && !sourceFile.isDeclarationFile;
            } )
            .map( ( sourceFile: typescript.SourceFile ): string => {
                return sourceFile.fileName; // This is actually the path ... weird, right?
            } );

        // Create TypeScript project, and load in the source files discovered above
        this.typescriptProject = new Project();
        this.typescriptProject.addExistingSourceFiles( absoluteSourceFilePaths );

    }

    /**
     * Get list of all external imports
     */
    public getAllExternalImportSources(): Array<string> {
        const externalImportSources: Array<string> = this.typescriptProject.getSourceFiles()
            .reduce( ( externalImports: Array<string>, sourceFile: SourceFile ): Array<string> => {
                return [
                    ...externalImports,
                    ...AngularImportFileAnalyzer.getExternalImportSources( sourceFile ),
                ];
            }, [] );
        const externalImportSourcesDeduplicated: Array<string> = deduplicateArray( externalImportSources );
        return externalImportSourcesDeduplicated;
    }

    /**
     * Get all external templates
     *
     * @returns External templates
     */
    // public getAllExternalTemplates(): Array<AngularExternalTemplate> {
    //     return this.typescriptProject.getSourceFiles()
    //         .reduce( ( externalTemplates: Array<AngularExternalTemplate>, sourceFile: SourceFile ): Array<AngularExternalTemplate> => {
    //             externalTemplates.push( ...AngularExternalResourcesAnayzer.getExternalTemplates( sourceFile ) );
    //             return externalTemplates;
    //         }, [] );
    // }

    /**
     * Get all external styles
     *
     * @returns External styles
     */
    // public getAllExternalStyles(): Array<AngularExternalStyles> {
    //     return this.typescriptProject.getSourceFiles()
    //         .reduce( ( externalStyles: Array<AngularExternalStyles>, sourceFile: SourceFile ): Array<AngularExternalStyles> => {
    //             externalStyles.push( ...AngularExternalResourcesAnayzer.getExternalStyles( sourceFile ) );
    //             return externalStyles;
    //         }, [] );
    // }

}
