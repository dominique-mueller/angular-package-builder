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
            this.sourceFiles.map( async ( sourceFile: SourceFile ): Promise<void> => {

                // Apply transformtions
                await this.inlineExternalTemplates( sourceFile );
                await this.inlineExternalStyles( sourceFile );
                this.convertLineBreaks( sourceFile );
                await this.save( sourceFile );

                processedFiles++;
                const relativeFilePath: string = path.relative( this.angularPackage.root, sourceFile.getFilePath() );
                const message: string = `Transform files (${processedFiles}/${numberOfFiles}) :: ${relativeFilePath}`;
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
                .map( async ( externalTemplate: AngularExternalTemplate ): Promise<void> => {

                    // Read
                    let template: string;
                    try {
                        template = await readFile( externalTemplate.template.path );
                    } catch ( error ) {
                        this.handleExternalTemplateError(
                            'An error occured while reading an external template.',
                            'Make sure the template URL is correct, and the referenced template file does exist.',
                            externalTemplate,
                            sourceFile
                        );
                    }

                    // Transform and inline
                    try {
                        await AngularExternalTemplatesFileTransformer.inlineExternalTemplate( externalTemplate, template );
                    } catch ( error ) {
                        this.handleExternalTemplateError(
                            'An error occured while transforming an external template.',
                            'Make sure the external template has a supported file format and is syntactically correct.',
                            externalTemplate,
                            sourceFile,
                            error
                        );
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
                .map( async ( externalStyle: AngularExternalStyles ): Promise<void> => {

                    // Read
                    const styles: Array<string> = await Promise.all(
                        externalStyle.styles.map( async ( style: AngularExternalResource ): Promise<string> => {
                            try {
                                return await readFile( style.path );
                            } catch ( error ) {
                                this.handleExternalStyleError(
                                    'An error occured while reading an external style.',
                                    'Make sure the style URL is correct, and the referenced style file does exist.',
                                    externalStyle,
                                    style,
                                    sourceFile
                                );
                            }
                        } )
                    );

                    // Transform and inline
                    await Promise.all(
                        styles.map( async ( style: string, index: number ): Promise<void> => {
                            try {
                                await AngularExternalStylesTransformer.inlineExternalStyle( externalStyle, externalStyle.styles[ index ], style );
                            } catch ( error ) {
                                this.handleExternalStyleError(
                                    'An error occured while transforming an external style.',
                                    'Make sure the external style has a supported file format and is syntactically correct.',
                                    externalStyle,
                                    externalStyle.styles[ index ],
                                    sourceFile,
                                    error,
                                );
                            }
                        } )
                    );

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

    /**
     * Log external template read error
     *
     * @param message          Message
     * @param tip              Tip
     * @param externalTemplate External template
     * @param sourceFile       Source file
     * @param details          Error details
     */
    private handleExternalTemplateError (
        message: string,
        tip: string,
        externalTemplate: AngularExternalTemplate,
        sourceFile: SourceFile,
        details?: Error
    ): void {

        // Collect information
        const templateUrl: string = externalTemplate.template.node.getText().replace( /'/g, '' );
        const sourceFilePath: string = `./${path.relative( this.angularPackage.root, sourceFile.getFilePath() )}`;
        const { line, character } = sourceFile.compilerNode.getLineAndCharacterOfPosition( externalTemplate.node.getStart() );
        const templateFilePath: string = `./${path.relative( this.angularPackage.root, externalTemplate.template.path )}`;

        const errorMessageDetails = !details || details.message === ''
            ? ''
            : `\n\nDetails:        ${details.message}`;

        // Log & re-throw
        const errorMessage: string = [
            `${ message }${errorMessageDetails}`,
            '',
            `Source file:    ${sourceFilePath} (at ${line + 1}:${character + 1})`,
            `Template url:   ${templateUrl}`,
            `Resolved file:  ${templateFilePath}`,
            '',
            `Tip: ${ tip }`
        ].join( '\n' );
        AngularPackageLogger.logMessage( errorMessage, 'error' );
        throw new Error( errorMessage );

    }

    /**
     * Log external style transform error
     *
     * @param message        Message
     * @param tip            Tip
     * @param externalStyles External styles
     * @param externalStyle  External style
     * @param sourceFile     Source file
     * @param details        Error details
     */
    private handleExternalStyleError(
        message: string,
        tip: string,
        externalStyles: AngularExternalStyles,
        externalStyle: AngularExternalResource,
        sourceFile: SourceFile,
        details?: Error,
    ): void {

        // Collect information
        const styleUrl: string = externalStyle.node.getText().replace( /'/g, '' );
        const sourceFilePath: string = `./${path.relative( this.angularPackage.root, sourceFile.getFilePath() )}`;
        const { line, character } = sourceFile.compilerNode.getLineAndCharacterOfPosition( externalStyles.node.getStart() );
        const styleFilePath: string = `./${path.relative( this.angularPackage.root, externalStyle.path )}`;

        const errorMessageDetails = !details || details.message === ''
            ? ''
            : `\n\nDetails:        ${details.message}`;

        // Log & re-throw
        const errorMessage: string = [
            `${ message }${errorMessageDetails}`,
            '',
            `Source file:    ${sourceFilePath} (at ${line + 1}:${character + 1})`,
            `Style url:      ${styleUrl}`,
            `Resolved file:  ${styleFilePath}`,
            '',
            `Tip: ${ tip }`
        ].join( '\n' );
        AngularPackageLogger.logMessage( errorMessage, 'error' );
        throw new Error( errorMessage );

    }

}
