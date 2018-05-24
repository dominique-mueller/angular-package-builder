import { ImportDeclaration, SourceFile, Project } from 'ts-simple-ast';

import { deduplicateArray } from '../utilities/deduplicate-array';

/**
 * Import Analyzer
 */
export class ImportAnalyzer {

    /**
     * Get all external import sources within a TypeScript project
     *
     * @param   typescriptProject TypeScript project
     * @returns                   List of external import sources
     */
    public static getExternalImportSources( typescriptProject: Project ): Array<string> {

        // Analyze source files for external imports
        const externalImportSources: Array<string> = typescriptProject.getSourceFiles()
            .reduce( ( externalImportSources: Array<string>, sourceFile: SourceFile ): Array<string> => {
                return [
                    ...externalImportSources,
                    ...this.getExternalImportSourcesOfFile( sourceFile ),
                ];
            }, [] );

        // Remove duplicates
        return deduplicateArray( externalImportSources );

    }

    /**
     * Get a list of external import sources
     *
     * @param   sourceFile Source File
     * @returns            List of external imports
     */
    private static getExternalImportSourcesOfFile( sourceFile: SourceFile ): Array<string> {
        return sourceFile.getImportDeclarations()
            .filter( this.isExternalImport )
            .map( this.getImportSource );
    }

    /**
     * Check whether the given import declaration points to an external module
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
        return importDeclaration.getModuleSpecifier()
            .getText()
            .replace( /['"`]/g, '' );
    }

}
