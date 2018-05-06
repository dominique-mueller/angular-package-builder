import { ImportDeclaration, SourceFile } from 'ts-simple-ast';

/**
 * Angular File Import Analyzer
 */
export class AngularFileImportAnalyzer {

    /**
     * Get a list of external imports
     *
     * @param   sourceFile Source File
     * @returns            List of external imports
     */
    public static getExternalImports( sourceFile: SourceFile ): Array<string> {
        return sourceFile.getImportDeclarations()

            // Filter out internal imports
            .filter( ( importDeclaration: ImportDeclaration ): boolean => {
                return !importDeclaration.isModuleSpecifierRelative();
            } )

            // Get import source
            .map( ( importDeclaration: ImportDeclaration ): string => {
                return importDeclaration
                    .getModuleSpecifier()
                    .getText()
                    .replace( /['"`]/g, '' );
            } );

    }

}
