import { posix as path } from 'path';

import Project, { SourceFile } from 'ts-simple-ast';

import { deduplicateArray } from '../utilities/deduplicate-array';
import { AngularImportFileAnalyzer } from './imports/angular-import.file-analyzer';
import { getTypeScriptProjectFiles } from '../utilities/get-typescript-project-files';

/**
 * Angular Package Transformer
 */
export class AngularPackageTransformer {

    /**
     * Source files
     */
    public get sourceFiles(): Array<SourceFile> {
        return this.typescriptProject.getSourceFiles();
    };

    /**
     * Source files with paths
     */
    public get sourceFilesWithPaths(): { [ path: string ]: string } {
        return this.sourceFiles
            .reduce( ( files: { [ path: string ]: string }, sourceFile: SourceFile ): { [ path: string ]: string } => {
                files[ sourceFile.getFilePath() ] = sourceFile.getText();
                return files;
            }, {} );
    }

    /**
     * TypeScript project
     */
    private readonly typescriptProject: Project;

    /**
     * Constructor
     *
     * @param entryFilePath Path to the package entry file (e.g. 'index.ts' file)
     */
    constructor( entryFilePath: string ) {
        const sourceFiles: Array<string> = getTypeScriptProjectFiles( entryFilePath );
        this.typescriptProject = new Project();
        this.typescriptProject.addExistingSourceFiles( sourceFiles );
    }

    /**
     * Get list of all external imports
     */
    public getAllExternalImportSources(): Array<string> {
        const externalImportSources: Array<string> = this.sourceFiles
            .reduce( ( externalImports: Array<string>, sourceFile: SourceFile ): Array<string> => {
                return [
                    ...externalImports,
                    ...AngularImportFileAnalyzer.getExternalImportSources( sourceFile ),
                ];
            }, [] );
        const externalImportSourcesDeduplicated: Array<string> = deduplicateArray( externalImportSources );
        return externalImportSourcesDeduplicated;
    }

}
