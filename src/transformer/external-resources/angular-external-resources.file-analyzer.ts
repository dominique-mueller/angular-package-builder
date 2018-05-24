import * as path from 'path';

import { ObjectLiteralExpression, ClassDeclaration, SourceFile, Decorator, PropertyAssignment, StringLiteral } from 'ts-simple-ast';

/**
 * [Abstract] Angular External Resources Analyzer
 */
export abstract class AngularExternalResourcesFileAnalyzer {

    /**
     * Get a component decorator property, throws if it does not exist
     *
     * @param   classDeclaration Potential component class
     * @param   propertyName     Property name
     * @returns                  Component decorator proeprty
     */
    protected static getComponentDecoratorPropertyOrThrow( classDeclaration: ClassDeclaration, propertyName: string ): PropertyAssignment {
        const componentDecorator: Decorator = classDeclaration.getDecoratorOrThrow( 'Component' );
        const componentDecoratorArgument: ObjectLiteralExpression = <ObjectLiteralExpression>componentDecorator.getArguments()[ 0 ] ||
            ( () => { throw new Error( 'Component decorator does not have an argument.' ) } )();
        const componentDecoratorProperty: PropertyAssignment = <PropertyAssignment>componentDecoratorArgument.getPropertyOrThrow( propertyName );
        return componentDecoratorProperty;
    }

    /**
     * Get external resource path of value
     *
     * @param   externalResourceAssigmentValue External resource value
     * @returns                                External resource path
     */
    protected static getExternalResourcePath( externalResourceAssigmentValue: StringLiteral ): string {
        return externalResourceAssigmentValue
            .getText()
            .replace( /['"`]/g, '' );
    }

    /**
     * Resolve external resource path to an absolute path, based on the source file
     *
     * @param   externalResourcePath External resource path (relative or absolute)
     * @returns                      Absolute resource path, based on the source file
     */
    protected static resolveExternalResourcePath( externalResourcePath: string, file: SourceFile ): string {
        return path.isAbsolute( externalResourcePath )
            ? externalResourcePath
            : path.join( path.dirname( file.getFilePath() ), externalResourcePath );
    }

}
