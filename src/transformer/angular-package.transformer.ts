import { posix as path } from 'path';

import Project, { SourceFile } from 'ts-simple-ast';

import { deduplicateArray } from '../utilities/deduplicate-array';
import { AngularImportFileAnalyzer } from './imports/angular-import.file-analyzer';
import { getTypeScriptProjectFiles } from '../utilities/get-typescript-project-files';
import { AngularExternalTemplate, AngularExternalStyles, AngularExternalResource } from './external-resources/angular-external-resources.interfaces';
import { AngularExternalTemplatesFileAnalyzer } from './external-resources/angular-external-templates.file-analyzer';
import { AngularExternalTemplatesFileTransformer } from './external-resources/angular-external-templates.file-transformer';
import { readFile } from '../utilities/read-file';
import { AngularExternalStylesFileAnalyzer } from './external-resources/angular-external-styles.file-analyzer';
import { AngularExternalStylesFileTransformer } from './external-resources/angular-external-styles.file-transformer';

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
        const sourceFiles: Array<string> = getTypeScriptProjectFiles( entryFilePath );
        this.typescriptProject = new Project();
        this.typescriptProject.addExistingSourceFiles( sourceFiles );
    }

    public async inlineExternalTemplates(): Promise<void> {

        // Apply transformation for each source file
        await Promise.all(
            this.sourceFiles.map( async( sourceFile: SourceFile ): Promise<void> => {

                // Find external templates
                const externalTemplates: Array<AngularExternalTemplate> = AngularExternalTemplatesFileAnalyzer.getExternalTemplates( sourceFile );

                // Read and inline external templates
                await Promise.all(
                    externalTemplates.map( async( externalTemplate: AngularExternalTemplate ): Promise<void> => {
                        const template: string = await readFile( externalTemplate.template.path );
                        AngularExternalTemplatesFileTransformer.inlineExternalTemplate( externalTemplate, template );
                    } )
                );

            } )
        );

    }

    public async inlineExternalStyles(): Promise<void> {

        // Apply transformation for each source file
        await Promise.all(
            this.sourceFiles.map( async( sourceFile: SourceFile ): Promise<void> => {

                // Find external styles
                const externalStyles: Array<AngularExternalStyles> = AngularExternalStylesFileAnalyzer.getExternalStyles( sourceFile );

                // Read and inline external styles
                await Promise.all(
                    externalStyles.map( async( externalStyle: AngularExternalStyles ): Promise<void> => {
                        const styles: Array<string> = await Promise.all(
                            externalStyle.styles.map( ( style: AngularExternalResource ): Promise<string> => {
                                return readFile( style.path );
                            } )
                        );
                        await AngularExternalStylesFileTransformer.inlineExternalStyles( externalStyle, styles );
                    } )
                );

            } )
        );

    }

    public convertLineBreaks(): void {

        // Apply transformation for each source file
        this.sourceFiles.forEach( ( sourceFile: SourceFile ) => {
            sourceFile.formatText( {
                newLineCharacter: '\n'
            } );
        } );

    }

    /**
     * Get list of all external imports
     */
    // public getAllExternalImportSources(): Array<string> {
    //     const externalImportSources: Array<string> = this.sourceFiles
    //         .reduce( ( externalImports: Array<string>, sourceFile: SourceFile ): Array<string> => {
    //             return [
    //                 ...externalImports,
    //                 ...AngularImportFileAnalyzer.getExternalImportSources( sourceFile ),
    //             ];
    //         }, [] );
    //     const externalImportSourcesDeduplicated: Array<string> = deduplicateArray( externalImportSources );
    //     return externalImportSourcesDeduplicated;
    // }

}
