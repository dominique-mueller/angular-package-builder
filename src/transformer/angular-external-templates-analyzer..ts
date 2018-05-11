import { SyntaxKind, ClassDeclaration, SourceFile, PropertyAssignment, StringLiteral, Identifier } from 'ts-simple-ast';

import { AngularExternalTemplate } from './angular-external-resources-analyzer.interfaces';
import { AngularExternalResourcesAnayzer } from './angular-external-resources-analyzer.abstract';

/**
 * Angular External Templates Analyzer
 */
export class AngularExternalTemplatesAnayzer extends AngularExternalResourcesAnayzer {

    /**
     * Get external templates
     *
     * @param   sourceFile Source File
     * @returns            List of external templates
     */
    public static getExternalTemplates( sourceFile: SourceFile ): Array<AngularExternalTemplate> {
        return sourceFile

            // Analyze (potential component) classes
            .getClasses()

            // Find external templates in the classes
            .reduce( ( externalTemplateAssignment: Array<PropertyAssignment>, classDeclaration: ClassDeclaration ): Array<PropertyAssignment> => {
                try {
                    return [
                        ...externalTemplateAssignment,
                        this.getComponentDecoratorPropertyOrThrow( classDeclaration, 'templateUrl' )
                    ];
                } catch {
                    // Do nothing
                } finally {
                    return externalTemplateAssignment;
                }
            }, [] )

            // Get additional external template information
            .map( ( externalTemplateAssignment: PropertyAssignment ): AngularExternalTemplate => {

                // Parse external template
                const externalTemplateKey: Identifier = this.getExternalTemplateAssignmentKeyOrThrow( externalTemplateAssignment );
                const externalTemplateValue: StringLiteral = this.getExternalTemplateAssignmentValueOrThrow( externalTemplateAssignment );

                // Get external resource paths
                const externalTemplatePath: string = this.getExternalResourcePath( externalTemplateValue );
                const resolvedExternalTemplatePath: string = this.resolveExternalResourcePath( externalTemplatePath, sourceFile );

                // Return external template definition
                return {
                    node: externalTemplateKey,
                    template: {
                        node: externalTemplateValue,
                        path: resolvedExternalTemplatePath
                    }
                };

            } );
    }

    /**
     * Get external template assignment key, or throw if it does not exist
     *
     * @param   externalTemplateAssignment External template assignment
     * @returns                            External template key
     */
    private static getExternalTemplateAssignmentKeyOrThrow( externalTemplateAssignment: PropertyAssignment ): Identifier {
        return externalTemplateAssignment.getChildrenOfKind( SyntaxKind.Identifier )[ 0 ] ||
            ( () => { throw new Error( 'External template does not have a key.' ) } )();
    }

    /**
     * Get external template assignment value, or throw if it does not exist
     *
     * @param   externalTemplateAssignment External template assignment
     * @returns                            External template value
     */
    private static getExternalTemplateAssignmentValueOrThrow( externalTemplateAssignment: PropertyAssignment ): StringLiteral {
        return externalTemplateAssignment.getChildrenOfKind( SyntaxKind.StringLiteral )[ 0 ] ||
            ( () => { throw new Error( 'External template doesn ot have a vlaue.' ) } )();
    }

}
