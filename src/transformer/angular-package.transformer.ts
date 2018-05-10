import { posix as path } from 'path';

import * as typescript from 'typescript';
import Project, { SourceFile } from 'ts-simple-ast';

import { AngularFileImportAnalyzer } from './angular-file-import.analyzer';
import { AngularExternalTemplate } from './angular-external-template.interface';
import { AngularExternalResource } from './angular-external-resource.interface';
import { AngularFileExternalResourcesAnayzer } from './angular-file-external-resources.analyzer';
import { AngularExternalStyles } from './angular-external-styles.interface';
import { deduplicateArray } from '../utilities/deduplicate-array';

/**
 * Angular Package Transformer
 */
export class AngularPackageTransformer {

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
     * Get all project source files
     *
     * @returns Source files with content (path -> content)
     */
    public getSourceFiles(): { [ path: string ]: string } {
        return this.typescriptProject.getSourceFiles()
            .reduce( ( files: { [ path: string ]: string }, sourceFile: SourceFile ): { [ path: string ]: string } => {
                files[ sourceFile.getFilePath() ] = sourceFile.getText();
                return files;
            }, {} );
    }

    /**
     * Get list of all external imports
     */
    public getExternalImports(): Array<string> {

        // Get external imports from all project files, as a flattened list
        const externalImports: Array<string> = this.typescriptProject.getSourceFiles()
            .reduce( ( externalImports: Array<string>, sourceFile: SourceFile ): Array<string> => {
                externalImports.push( ...AngularFileImportAnalyzer.getExternalImportSources( sourceFile ) );
                return externalImports;
            }, [] );

        // Deduplicate external imports
        return deduplicateArray( externalImports );

    }

    /**
     * Get all external templates
     *
     * @returns External templates
     */
    public getAllExternalTemplates(): Array<AngularExternalTemplate> {
        return this.typescriptProject.getSourceFiles()
            .reduce( ( externalTemplates: Array<AngularExternalTemplate>, sourceFile: SourceFile ): Array<AngularExternalTemplate> => {
                externalTemplates.push( ...AngularFileExternalResourcesAnayzer.getExternalTemplates( sourceFile ) );
                return externalTemplates;
            }, [] );
    }

    /**
     * Get all external styles
     *
     * @returns External styles
     */
    public getAllExternalStyles(): Array<AngularExternalStyles> {
        return this.typescriptProject.getSourceFiles()
            .reduce( ( externalStyles: Array<AngularExternalStyles>, sourceFile: SourceFile ): Array<AngularExternalStyles> => {
                externalStyles.push( ...AngularFileExternalResourcesAnayzer.getExternalStyles( sourceFile ) );
                return externalStyles;
            }, [] );
    }

    /**
     * Rewrite external template to internal one (manipulates source code!)
     *
     * @param externalTemplate External template
     * @param template         Template
     */
    public rewriteExternalTemplateToInternalTemplate( externalTemplate: AngularExternalTemplate, template: string ): void {
        externalTemplate.node.replaceWithText( 'template' );
        externalTemplate.template.node.replaceWithText( `'${ template }'` );
    }

    /**
     * Rewrite external styles to internal ones (manipulates source code!)
     *
     * @param externalStyles External styles
     * @param styles         Styles
     */
    public rewriteExternalStylesToInternalStyles( externalStyles: AngularExternalStyles, styles: Array<string> ): void {
        externalStyles.node.replaceWithText( 'styles' );
        externalStyles.styles.forEach( ( style: AngularExternalResource, index: number ): void => {
            style.node.replaceWithText( `'${ styles[ index ] }'` );
        } );
    }

}
