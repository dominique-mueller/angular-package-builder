import { SyntaxKind, ClassDeclaration, SourceFile, PropertyAssignment, StringLiteral, Identifier, ArrayLiteralExpression } from 'ts-simple-ast';

import { AngularExternalResource, AngularExternalStyles } from './angular-external-resources-analyzer.interfaces';
import { AngularExternalResourcesAnayzer } from './angular-external-resources-analyzer.abstract';

/**
 * Angular External Styles Analyzer
 */
export class AngularExternalStylesAnayzer extends AngularExternalResourcesAnayzer {

    /**
     * Get external styles
     *
     * @param   sourceFile Source File
     * @returns            List of external styles
     */
    public static getExternalStyles( sourceFile: SourceFile ): Array<AngularExternalStyles> {
        return sourceFile

            // Analyze (potential component) classes
            .getClasses()

            // Find external styles in the classes
            .reduce( ( externalStylesAssignment: Array<PropertyAssignment>, classDeclaration: ClassDeclaration ): Array<PropertyAssignment> => {
                try {
                    return [
                        ...externalStylesAssignment,
                        this.getComponentDecoratorPropertyOrThrow( classDeclaration, 'styleUrls' )
                    ];
                } catch {
                    // Do nothing
                } finally {
                    return externalStylesAssignment;
                }
            }, [] )

            // Get additional external template information
            .map( ( externalStylesAssignment: PropertyAssignment ): AngularExternalStyles => {

                // Parse external styles
                const externalStylesKey: Identifier = this.getExternalStylesAssignmentKeyOrThrow( externalStylesAssignment );
                const externalStyleValues: Array<StringLiteral> = this.getExternalStylesAssignmentValuesOrThrow( externalStylesAssignment );

                // Get external resource paths
                const externalStyles: Array<AngularExternalResource> = externalStyleValues
                    .map( ( externalStyleValue: StringLiteral ): AngularExternalResource => {
                        const externalStylePath: string = this.getExternalResourcePath( externalStyleValue );
                        const resolvedExternalStylePath: string = this.resolveExternalResourcePath( externalStylePath, sourceFile );
                        return {
                            node: externalStyleValue,
                            path: resolvedExternalStylePath
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
     * Get external styles assignment key
     *
     * @param   externalStylesAssignment External styles assignment
     * @returns                          External styles key
     */
    private static getExternalStylesAssignmentKeyOrThrow( externalStylesAssignment: PropertyAssignment ): Identifier {
        return externalStylesAssignment.getChildrenOfKind( SyntaxKind.Identifier )[ 0 ] ||
            ( () => { throw new Error( 'External template does not have a key.' ) } )();
    }

    /**
     * Get external styles property value
     *
     * @param   externalStylesAssignment External styles assignment
     * @returns                          External styles values
     */
    private static getExternalStylesAssignmentValuesOrThrow( externalStylesAssignment: PropertyAssignment ): Array<StringLiteral> {
        const externalStylesAssignmentValue: ArrayLiteralExpression =
            externalStylesAssignment.getChildrenOfKind( SyntaxKind.ArrayLiteralExpression )[ 0 ] ||
            ( () => { throw new Error( 'External template doesn ot have a vlaue.' ) } )();
        const externalStylesAssignmentValues: Array<StringLiteral> = <Array<StringLiteral>> externalStylesAssignmentValue.getElements();
        return externalStylesAssignmentValues;
    }

}
