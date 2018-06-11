import { posix as path } from 'path';

import { SourceFile } from 'ts-simple-ast';

import { AngularExternalTemplate, AngularExternalStyles, AngularExternalResource } from './external-resources/angular-external-resources.interfaces';
import { AngularExternalTemplatesFileAnalyzer } from './external-templates/angular-external-templates.analyzer';
import { AngularExternalTemplatesFileTransformer } from './external-templates/angular-external-templates.transformer';
import { readFile } from '../utilities/read-file';
import { AngularExternalStylesAnalyzer } from './external-styles/angular-external-styles.analyzer';
import { AngularExternalStylesTransformer } from './external-styles/angular-external-styles.transformer';
import { writeFile } from '../utilities/write-file';
import { AngularPackage } from '../angular-package';
import { AngularPackageLogger } from '../logger/angular-package-logger';

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

        let numberOfFiles: number = this.sourceFiles.length;
        let processedFiles: number = 0;

        // Apply transformation for each source file
        await Promise.all(
            this.sourceFiles.map( async( sourceFile: SourceFile ): Promise<void> => {

                // Apply transformtions
                await this.inlineExternalTemplates( sourceFile );
                await this.inlineExternalStyles( sourceFile );
                this.convertLineBreaks( sourceFile );
                await this.save( sourceFile );

                processedFiles++;
                const relativeFilePath: string = path.relative( this.angularPackage.root, sourceFile.getFilePath() );
                const message: string = `Transform files (${ processedFiles }/${ numberOfFiles }) :: ${ relativeFilePath }`;
                AngularPackageLogger.logMessage( message );

            } )
        );

    }

    /**
     * Inline external templates in the given file
     *
     * @param   sourceFile Source file
     * @returns            Promise, resolved when done
     */
    private async inlineExternalTemplates( sourceFile: SourceFile ): Promise<void> {
        await Promise.all(
            AngularExternalTemplatesFileAnalyzer.getExternalTemplates( sourceFile )
                .map( async( externalTemplate: AngularExternalTemplate ): Promise<void> => {
                    try {
                        const template: string = await readFile( externalTemplate.template.path );
                        AngularExternalTemplatesFileTransformer.inlineExternalTemplate( externalTemplate, template );
                    } catch ( error ) {
                        const sourceFilePath: string = path.relative( this.angularPackage.root, sourceFile.getFilePath() );
                        const templatePath: string = path.relative( this.angularPackage.root, externalTemplate.template.path );
                        AngularPackageLogger.logMessage( [
                            'An error occured while reading an external template file.',
                            `Details: Source File: "${ sourceFilePath }"`,
                            `         Template URL: "${ externalTemplate.template.node.getText().replace( /'/g, '' ) }"`,
                            `         Resolved Template: "${ templatePath }"`,
                            'Make sure the template URL is correct, and the template does exist.'
                        ].join( '\n' ), 'error' );
                        throw new Error(); // Bubble-up
                    }
                } )
        );
    }

    /**
     * Inline external styles
     *
     * @param   sourceFile Source file
     * @returns            Promise, resolves when done
     */
    private async inlineExternalStyles( sourceFile: SourceFile ): Promise<void> {
        await Promise.all(
            AngularExternalStylesAnalyzer.getExternalStyles( sourceFile )
                .map( async( externalStyle: AngularExternalStyles ): Promise<void> => {
                    const styles: Array<string> = await Promise.all(
                        externalStyle.styles.map( ( style: AngularExternalResource ): Promise<string> => {
                            return readFile( style.path );
                        } )
                    );
                    await AngularExternalStylesTransformer.inlineExternalStyles( externalStyle, styles );
                } )
        );
    }

    /**
     * Convert line breaks
     *
     * @param sourceFile Source file
     */
    private convertLineBreaks( sourceFile: SourceFile ): void {
        sourceFile.formatText( {
            newLineCharacter: '\n' // Linux!!
        } );
    }

    /**
     * Save transformation results
     *
     * @param   sourceFile Source file
     * @returns            Promise, resolves when done
     */
    private async save( sourceFile: SourceFile ): Promise<void> {

        // Determine the file output path
        const absoluteEntryPath: string = path.join( this.angularPackage.root, this.angularPackage.entryFile );
        const absoluteOutputPath: string = path.join( this.angularPackage.root, this.angularPackage.outDir );
        const relativeFilePath: string = path.relative( path.dirname( absoluteEntryPath ), sourceFile.getFilePath() );
        const filePathOut: string = path.join( absoluteOutputPath, 'temp', 'transformed', relativeFilePath );

        // Write files to disk
        await writeFile( filePathOut, sourceFile.getText() );

    }

}
