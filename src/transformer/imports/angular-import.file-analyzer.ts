import { ImportDeclaration, SourceFile } from 'ts-simple-ast';

/**
 * Angular Import File Analyzer
 */
export class AngularImportFileAnalyzer {

    /**
     * Get a list of external import sources
     *
     * @param   sourceFile Source File
     * @returns            List of external imports
     */
    public static getExternalImportSources( sourceFile: SourceFile ): Array<string> {
        return sourceFile.getImportDeclarations()
            .filter( this.isExternalImport )
            .map( this.getImportSource );
    }

    /**
     * Check if the given import declaration points to an external module
     *
     * @param   importDeclaration Import declaration
     * @returns                   Flag, describing whether the import is external
     */
    private static isExternalImport( importDeclaration: ImportDeclaration ): boolean {
        return !importDeclaration.isModuleSpecifierRelative();
    }

    /**
     * Get the import source of an import declaration
     *
     * @param   importDeclaration Import declaration
     * @returns                   Import source
     */
    private static getImportSource( importDeclaration: ImportDeclaration ): string {
        return importDeclaration
            .getModuleSpecifier()
            .getText()
            .replace( /['"`]/g, '' );
    }

}
