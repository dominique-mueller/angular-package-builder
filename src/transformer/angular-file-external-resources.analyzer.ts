import { posix as path } from 'path';

import { ObjectLiteralExpression, SyntaxKind, ClassDeclaration, SourceFile, Decorator, PropertyAssignment, StringLiteral, Identifier, ArrayLiteralExpression } from 'ts-simple-ast';

import { AngularExternalTemplate } from './angular-external-template.interface';
import { AngularExternalStyles } from './angular-external-styles.interface';

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
        return sourceFile
            .getClasses()
            .reduce( ( externalTemplates: Array<AngularExternalTemplate>, classDeclaration: ClassDeclaration ): Array<AngularExternalTemplate> => {

                try {

                    // Get template URL property, plus key and value
                    const templateUrlProperty: PropertyAssignment = this.getComponentDecoratorProperty( classDeclaration, 'templateUrl' );
                    const templateUrlKey: Identifier = <Identifier>templateUrlProperty.getChildrenOfKind( SyntaxKind.Identifier )[ 0 ];
                    const templateUrlValue: StringLiteral = <StringLiteral>templateUrlProperty.getChildrenOfKind( SyntaxKind.StringLiteral )[ 0 ];

                    // Get absolute template path
                    const templateUrlPath = templateUrlValue
                        .getText()
                        .replace( /['"`]/g, '' );
                    const templateUrlAbsolutePath: string = path.isAbsolute( templateUrlPath )
                        ? templateUrlPath
                        : path.join( path.dirname( sourceFile.getFilePath() ), templateUrlPath );

                    // Add external template to list
                    externalTemplates.push( {
                        node: templateUrlKey,
                        template: {
                            path: templateUrlAbsolutePath,
                            node: templateUrlValue,
                        }
                    } );

                } catch ( error ) {
                    // Do nothing
                } finally {
                    return externalTemplates;
                }

            }, [] );
    }

    /**
     * Get external styles
     *
     * @param   sourceFile Source File
     * @returns            List of external styles
     */
    public static getExternalStyles( sourceFile: SourceFile ): Array<AngularExternalStyles> {
        return sourceFile
            .getClasses()
            .reduce( ( externalStyles: Array<AngularExternalStyles>, classDeclaration: ClassDeclaration ): Array<AngularExternalStyles> => {

                try {

                    // Get template URL property, plus key and values
                    const styleUrlsProperty: PropertyAssignment = this.getComponentDecoratorProperty( classDeclaration, 'styleUrls' );
                    const styleUrlsKey: Identifier = <Identifier>styleUrlsProperty.getChildrenOfKind( SyntaxKind.Identifier )[ 0 ];
                    const styleUrlsValue: ArrayLiteralExpression = <ArrayLiteralExpression>styleUrlsProperty.getChildrenOfKind( SyntaxKind.ArrayLiteralExpression )[ 0 ];
                    const styleUrlsValues: Array<StringLiteral> = <Array<StringLiteral>>styleUrlsValue.getElements();

                    // Get absolute style URL paths
                    const absoluteStyleUrlPaths = styleUrlsValues
                        .map( ( styleUrlValue: StringLiteral ): string => {
                            return styleUrlValue
                                .getText()
                                .replace( /['"`]/g, '' );
                        } )
                        .map( ( styleUrlPath: string ): string => {
                            return path.isAbsolute( styleUrlPath )
                                ? styleUrlPath
                                : path.join( path.dirname( sourceFile.getFilePath() ), styleUrlPath );
                        } );

                    // Add external style to the list
                    externalStyles.push( {
                        node: styleUrlsKey,
                        styles: styleUrlsValues.map( ( styleUrlsValue: StringLiteral, index: number ) => {
                            return {
                                node: styleUrlsValue,
                                path: absoluteStyleUrlPaths[ index ]
                            };
                        } )
                    } );

                } catch ( error ) {
                    // Do nothing
                } finally {
                    return externalStyles;
                }

            }, [] );
    }

    /**
     * Get component decorator property, throws if something goes wrong (e.g. no decorator, no property, ...)
     *
     * @param   classDeclaration Class declaration
     * @param   propertyName     Property name
     * @returns                  Property node
     */
    private static getComponentDecoratorProperty( classDeclaration: ClassDeclaration, propertyName: string ): PropertyAssignment {

        // Get component decorator
        const componentDecorator: Decorator = classDeclaration.getDecoratorOrThrow( 'Component' );

        // Get decorator property
        const componentDecoratorObject: ObjectLiteralExpression = <ObjectLiteralExpression>componentDecorator.getArguments()[ 0 ];
        if ( !componentDecoratorObject ) {
            throw new Error( 'Component decorator empty.' );
        }

        // Get property
        const property: PropertyAssignment = <PropertyAssignment>componentDecoratorObject.getPropertyOrThrow( propertyName );

        return property;

    }

}
