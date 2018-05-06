import { posix as path } from 'path';

import * as typescript from 'typescript';
import Project, { SourceFile, Identifier, StringLiteral, } from 'ts-simple-ast';

import { AngularFileImportAnalyzer } from './angular-file-import.analyzer';
import { AngularExternalTemplate } from './angular-external-template.interface';
import { AngularExternalResource } from './angular-external-resource.interface';
import { AngularFileExternalResourcesAnayzer } from './angular-file-external-resources.analyzer';
import { AngularExternalStyles } from './angular-external-styles.interface';

/**
 * Angular Package Transformer
 */
export class AngularPackageTransformer {

    /**
     * TypeScript project
     */
    public readonly typescriptProject: Project;

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
                return sourceFile.fileName; // This is actually the path!
            } );

        // Create TypeScript project, and load in the source files discovered above
        this.typescriptProject = new Project();
        this.typescriptProject.addExistingSourceFiles( absoluteSourceFilePaths );

    }

    /**
     * Get list of all external imports
     */
    public getExternalImports(): Array<string> {

        // Deduplicate external imports
        return this.deduplicateArray(

            // Get external imports of all files
            this.typescriptProject
                .getSourceFiles()
                .reduce( ( externalImports: Array<string>, sourceFile: SourceFile ): Array<string> => {
                    externalImports.push( ...AngularFileImportAnalyzer.getExternalImports( sourceFile ) );
                    return externalImports;
                }, [] )

        );

    }

    public rewriteExternalTemplateNode( node: Identifier ): void {
        node.replaceWithText( 'template' );
    }

    public rewriteExternalStylesNode( node: Identifier ): void {
        node.replaceWithText( 'styles' );
    }

    public rewriteExternalResourceNode( node: StringLiteral, resrouce: string ): void {
        node.replaceWithText( `'${ resrouce }'` );
    }

    /**
     * Get all external templates
     *
     * @returns External templates, including the node and the resources
     */
    public getAllExternalTemplates(): {
        nodes: Array<Identifier>,
        resources: Array<AngularExternalResource>,
    } {

        // Get external templates of all files
        const externalTemplates: Array<AngularExternalTemplate> = this.typescriptProject
            .getSourceFiles()
            .reduce( ( externalTemplates: Array<AngularExternalTemplate>, sourceFile: SourceFile ): Array<AngularExternalTemplate> => {
                externalTemplates.push( ...AngularFileExternalResourcesAnayzer.getExternalTemplates( sourceFile ) );
                return externalTemplates;
            }, [] );

        // Get external template nodes
        const nodes: Array<Identifier> = externalTemplates
            .map( ( externalTemplate: AngularExternalTemplate ) => {
                return externalTemplate.node;
            } );

        // Get external template resources
        const resources: Array<AngularExternalResource> = externalTemplates
            .map( ( externalTemplate: AngularExternalTemplate ) => {
                return externalTemplate.template;
            } );

        return { nodes, resources };

    }

    /**
     * Get all external styles
     *
     * @returns External styles, including the node and the resources
     */
    public getAllExternalStyles(): {
        nodes: Array<Identifier>,
        resources: Array<AngularExternalResource>,
    } {

        // Get external styles of all files
        const externalStyles: Array<AngularExternalStyles> = this.typescriptProject
            .getSourceFiles()
            .reduce( ( externalStyles: Array<AngularExternalStyles>, sourceFile: SourceFile ): Array<AngularExternalStyles> => {
                externalStyles.push( ...AngularFileExternalResourcesAnayzer.getExternalStyles( sourceFile ) );
                return externalStyles;
            }, [] );

        // Get external template nodes
        const nodes: Array<Identifier> = externalStyles
            .map( ( externalStyle: AngularExternalStyles ) => {
                return externalStyle.node;
            } );

        // Get external template resources
        const resources: Array<AngularExternalResource> = externalStyles
            .reduce( ( resources: Array<AngularExternalResource>, externalStyle: AngularExternalStyles ): Array<AngularExternalResource> => {
                resources.push( ...externalStyle.styles );
                return resources;
            }, [] );

        return { nodes, resources };

    }

    /**
     * Remove duplicates from array
     * Implementation inspired by: https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
     *
     * @param   array - Array containing possible duplicated
     * @returns       - Array without any duplicates
     */
    private deduplicateArray( array: Array<string> ): Array<string> {
        return [ ...new Set( array ) ];
    }

}
