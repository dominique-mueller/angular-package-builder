import * as path from 'path';

import Project, { SourceFile } from 'ts-simple-ast';

import { AngularExternalTemplate, AngularExternalStyles, AngularExternalResource } from './external-resources/angular-external-resources.interfaces';
import { AngularExternalTemplatesFileAnalyzer } from './external-templates/angular-external-templates.analyzer';
import { AngularExternalTemplatesFileTransformer } from './external-templates/angular-external-templates.transformer';
import { readFile } from '../utilities/read-file';
import { AngularExternalStylesAnalyzer } from './external-styles/angular-external-styles.analyzer';
import { AngularExternalStylesTransformer } from './external-styles/angular-external-styles.transformer';
import { writeFile } from '../utilities/write-file';
import { AngularPackage } from '../angular-package';

/**
 * Angular Package Transformer
 */
export class AngularPackageTransformer {

    /**
     * Source files
     */
    public get sourceFiles(): Array<SourceFile> {
        return this.angularPackage.typescriptProject.getSourceFiles();
    };

    /**
     * Angular Package
     */
    private readonly angularPackage: AngularPackage;

    /**
     * Constructor
     *
     * @param entryFilePath Path to the package entry file (e.g. 'index.ts' file)
     */
    constructor( angularPackage: AngularPackage ) {
        this.angularPackage = angularPackage;
    }

    /**
     * Transform
     *
     * @returns Promise, resovled when done
     */
    public async transform(): Promise<void> {

        // Do transformations
        await this.inlineExternalTemplates(),
        await this.inlineExternalStyles()
        this.convertLineBreaks();

        // Save
        await this.save();

    }

    /**
     * Inline external templates
     *
     * @returns Promise, resolved when done
     */
    private async inlineExternalTemplates(): Promise<void> {

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

    /**
     * Inline external styles
     *
     * @returns Promise, resolves when done
     */
    private async inlineExternalStyles(): Promise<void> {

        // Apply transformation for each source file
        await Promise.all(
            this.sourceFiles.map( async( sourceFile: SourceFile ): Promise<void> => {

                // Find external styles
                const externalStyles: Array<AngularExternalStyles> = AngularExternalStylesAnalyzer.getExternalStyles( sourceFile );

                // Read and inline external styles
                await Promise.all(
                    externalStyles.map( async( externalStyle: AngularExternalStyles ): Promise<void> => {
                        const styles: Array<string> = await Promise.all(
                            externalStyle.styles.map( ( style: AngularExternalResource ): Promise<string> => {
                                return readFile( style.path );
                            } )
                        );
                        await AngularExternalStylesTransformer.inlineExternalStyles( externalStyle, styles );
                    } )
                );

            } )
        );

    }

    /**
     * Convert line breaks
     */
    private convertLineBreaks(): void {

        // Apply transformation for each source file
        this.sourceFiles.forEach( ( sourceFile: SourceFile ) => {
            sourceFile.formatText( {
                newLineCharacter: '\n'
            } );
        } );

    }

    /**
     * Save transformation results
     *
     * @returns Promise, resolves when done
     */
    private async save(): Promise<void> {

        // Move the file paths
        const sourceFiles: Array<SourceFile> = this.sourceFiles;
        const sourceFilesOutPaths: Array<string> = this.sourceFiles
            .map( ( sourceFile: SourceFile ): string => {
                const filePath: string = sourceFile.getFilePath();
                const absoluteEntryPath: string = path.join( this.angularPackage.cwd, this.angularPackage.entryFile );
                const absoluteOutputPath: string = path.join( this.angularPackage.cwd, this.angularPackage.outDir );
                const relativeFilePath: string = path.relative( path.dirname( absoluteEntryPath ), filePath );
                const movedFilePath: string = path.join( absoluteOutputPath, 'temp', 'transformed', relativeFilePath );
                return movedFilePath;
            } );

        // Write files to disk
        await Promise.all(
            sourceFilesOutPaths.map( async( filePath: string, index: number ): Promise<void> => {
                await writeFile( filePath, sourceFiles[ index ].getText() );
            } )
        );

    }

}
