import * as typescript from 'typescript';

/**
 * Get all files included in a TypeScript project
 *
 * @param   entryFilePath Entry file path (absolute)
 * @returns               List of project files
 */
export function getTypeScriptProjectFiles( entryFilePath: string ): Array<string> {

    // Create TypeScript program; this also resolves all referenced modules and typings, both internal and external
    const typescriptProgram: typescript.Program = typescript.createProgram( [ entryFilePath ], {} );

    // Get all source file paths, but exclude external modules & typings
    return typescriptProgram.getSourceFiles()
        .filter( ( sourceFile: typescript.SourceFile ): boolean => {
            return !typescriptProgram.isSourceFileFromExternalLibrary( sourceFile );
        } )
        .filter( ( sourceFile: typescript.SourceFile ): boolean => {
            return !sourceFile.isDeclarationFile;
        } )
        .map( ( sourceFile: typescript.SourceFile ): string => {
            return sourceFile.fileName; // This is actually the path ... weird, right?
        } );

}
