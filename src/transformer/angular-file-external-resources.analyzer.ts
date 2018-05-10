import { posix as path } from 'path';

import { ObjectLiteralExpression, SyntaxKind, ClassDeclaration, SourceFile, Decorator, PropertyAssignment, StringLiteral, Identifier, ArrayLiteralExpression } from 'ts-simple-ast';

import { AngularExternalTemplate, AngularExternalResource, AngularExternalStyles } from './angular-file-external-resources.interfaces';

/**
 * Angular File External Resources Analyzer
 */
export class AngularFileExternalResourcesAnayzer {

    /**
     * Get external templates
     *
     * @param   sourceFile Source File
     * @returns            List of external templates
     */
    public static getExternalTemplates( sourceFile: SourceFile ): Array<AngularExternalTemplate> {
        return sourceFile.getClasses()

            // Find external templates in the classes
            .reduce( ( externalTemplateProperties: Array<PropertyAssignment>, classDeclaration: ClassDeclaration ): Array<PropertyAssignment> => {

                // Try to find an external template property in the component decorator
                try {
                    return [
                        ...externalTemplateProperties,
                        this.getExternalTemplateProperty(
                            this.getComponentDecoratorArgument(
                                this.getComponentDecorator( classDeclaration )
                            )
                        )
                    ];
                } catch ( error ) {
                    // Do nothing
                } finally {
                    return externalTemplateProperties;
                }

            }, [] )

            // Get additional external template information
            .map( ( externalTemplateProperty: PropertyAssignment ): AngularExternalTemplate => {

                // Parse external template
                const externalTemplateKey: Identifier = this.getExternalTemplateKey( externalTemplateProperty );
                const externalTemplateValue: StringLiteral = this.getExternalTemplateValue( externalTemplateProperty );

                // Get external resource definitions
                const externalTemplatePath: string = this.resolveExternalResourcePath(
                    this.getExternalResourcePath( externalTemplateValue ),
                    sourceFile
                );
                const externalTemplate: AngularExternalResource = {
                    node: externalTemplateValue,
                    path: externalTemplatePath
                };

                // Return external template definition
                return {
                    node: externalTemplateKey,
                    template: externalTemplate
                };

            } );
    }

    /**
     * Get external styles
     *
     * @param   sourceFile Source File
     * @returns            List of external styles
     */
    public static getExternalStyles( sourceFile: SourceFile ): Array<AngularExternalStyles> {
        return sourceFile.getClasses()

            // Find external styles in the classes
            .reduce( ( externalStylesProperties: Array<PropertyAssignment>, classDeclaration: ClassDeclaration ): Array<PropertyAssignment> => {

                // Try to find an external styles property in the component decorator
                try {
                    return [
                        ...externalStylesProperties,
                        this.getExternalStylesProperty(
                            this.getComponentDecoratorArgument(
                                this.getComponentDecorator( classDeclaration )
                            )
                        )
                    ];
                } catch ( error ) {
                    // Do nothing
                } finally {
                    return externalStylesProperties;
                }

            }, [] )

            // Get additional external styles information
            .map( ( externalStylesProperty: PropertyAssignment ): AngularExternalStyles => {

                // Parse external styles
                const externalStylesKey: Identifier = this.getExternalStylesKey( externalStylesProperty );
                const externalStyleValues: Array<StringLiteral> = this.getExternalStylesValues(
                    this.getExternalStylesValue( externalStylesProperty )
                );

                // Get external resource definitions
                const externalStyles: Array<AngularExternalResource> = externalStyleValues
                    .map( ( externalStyleValue: StringLiteral ) => {
                        const externalStylePath: string = this.resolveExternalResourcePath(
                            this.getExternalResourcePath( externalStyleValue ),
                            sourceFile
                        );
                        return {
                            node: externalStyleValue,
                            path: externalStylePath
                        };
                    } );

                // Return external styles definition
                return {
                    node: externalStylesKey,
                    styles: externalStyles
                };

            } );

    }

    /**
     * Get the component decorator of a class, throws is none exists
     *
     * @param   classDeclaration Class Declaration
     * @returns                  Component decorator
     */
    private static getComponentDecorator( classDeclaration: ClassDeclaration ): Decorator {
        return classDeclaration
            .getDecoratorOrThrow( 'Component' );
    }

    /**
     * Get component decorator argument, throws if none exist
     *
     * @param   componentDecorator Component decorator
     * @returns                    Component argument (object)
     */
    private static getComponentDecoratorArgument( componentDecorator: Decorator ): ObjectLiteralExpression {
        return <ObjectLiteralExpression>componentDecorator
            .getArguments()[ 0 ] ||
            ( () => { throw new Error( 'Component decorator does not have an argument.' ) } )();
    }

    /**
     * Get external template decorator property, throws if none exist
     *
     * @param   componentDecoratorAgument Component decorator argument
     * @returns                           Template URL property
     */
    private static getExternalTemplateProperty( componentDecoratorArgument: ObjectLiteralExpression ): PropertyAssignment {
        return <PropertyAssignment>componentDecoratorArgument
            .getPropertyOrThrow( 'templateUrl' );
    }

    /**
     * Get external styles decorator property, throws if none exist
     *
     * @param   componentDecoratorAgument Component decorator argument
     * @returns                           Style URLs property
     */
    private static getExternalStylesProperty( componentDecoratorArgument: ObjectLiteralExpression ): PropertyAssignment {
        return <PropertyAssignment>componentDecoratorArgument
            .getPropertyOrThrow( 'styleUrls' );
    }

    /**
     * Get external template property key
     *
     * @param   externalTemplateProperty External template property
     * @returns                          External template key
     */
    private static getExternalTemplateKey( externalTemplateProperty: PropertyAssignment ): Identifier {
        return externalTemplateProperty
            .getChildrenOfKind( SyntaxKind.Identifier )[ 0 ] ||
            ( () => { throw new Error( 'External template does not have a key.' ) } )();
    }

    /**
     * Get external template property value
     *
     * @param   externalTemplateProperty External template property
     * @returns                          External template value
     */
    private static getExternalTemplateValue( externalTemplateProperty: PropertyAssignment ): StringLiteral {
        return externalTemplateProperty
            .getChildrenOfKind( SyntaxKind.StringLiteral )[ 0 ] ||
            ( () => { throw new Error( 'External template doesn ot have a vlaue.' ) } )();
    }

    /**
     * Get external styles property key
     *
     * @param   externalStylesProperty External styles property
     * @returns                        External styles key
     */
    private static getExternalStylesKey( externalStylesProperty: PropertyAssignment ): Identifier {
        return externalStylesProperty
            .getChildrenOfKind( SyntaxKind.Identifier )[ 0 ] ||
            ( () => { throw new Error( 'External template does not have a key.' ) } )();
    }

    /**
     * Get external styles property value
     *
     * @param   externalStylesProperty External styles property
     * @returns                        External styles value
     */
    private static getExternalStylesValue( externalStylesProperty: PropertyAssignment ): ArrayLiteralExpression {
        return externalStylesProperty
            .getChildrenOfKind( SyntaxKind.ArrayLiteralExpression )[ 0 ] ||
            ( () => { throw new Error( 'External template doesn ot have a vlaue.' ) } )();
    }

    /**
     * Get external styles property value
     *
     * @param   externalStylesValue External styles value
     * @returns                     External styles values
     */
    private static getExternalStylesValues( externalStylesValue: ArrayLiteralExpression ): Array<StringLiteral> {
        return <Array<StringLiteral>>externalStylesValue.getElements();
    }

    /**
     * Get external resource path of value
     *
     * @param   externalResourceValue External resource value
     * @returns                       External resource path
     */
    private static getExternalResourcePath( externalResourceValue: StringLiteral ): string {
        return externalResourceValue
            .getText()
            .replace( /['"`]/g, '' );
    }

    /**
     * Resolve external resource path to an absolute path, based on the source file
     *
     * @param   externalResourcePath External resource path (relative or absolute)
     * @returns                      Absolute resource path, based on the source file
     */
    private static resolveExternalResourcePath( externalResourcePath: string, file: SourceFile ): string {
        return path.isAbsolute( externalResourcePath )
            ? externalResourcePath
            : path.join( path.dirname( file.getFilePath() ), externalResourcePath );
    }

}
