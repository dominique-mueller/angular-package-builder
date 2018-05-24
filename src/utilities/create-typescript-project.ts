import { posix as path } from 'path';

import Project from 'ts-simple-ast';
import * as typescript from 'typescript';

/**
 * Create TypeScript project from entry file
 *
 * This will return a TypeScript project based on the 'ts-simple-ast' library. It will include all resolved files, except external modules
 * (e.g. from node_modules) and TypeScript definition files.
 *
 * @param   entryFile Entry file
 * @returns           TypeScript project
 */
export function createTypescriptProject( entryFile: string ): Project {

	// Create TypeScript program, using the goo'old original TypeScript
	// This way, we resolve all referenced modules and typings as well (both internal and external)
	const typescriptProgram: typescript.Program = typescript.createProgram( [ entryFile ], {} );

	// Get all source file paths, but exclude external modules & typings
	const sourceFilePaths: Array<string> = typescriptProgram.getSourceFiles()
		.filter( ( sourceFile: typescript.SourceFile ): boolean => {
			return !typescriptProgram.isSourceFileFromExternalLibrary( sourceFile ) && !sourceFile.isDeclarationFile;
		} )
		.map( ( sourceFile: typescript.SourceFile ): string => {
			return sourceFile.fileName; // This is actually the path ... weird, right?
		} );

	// Create TypeScript project, based on the source file paths
	const typescriptProject: Project = new Project();
	typescriptProject.addExistingSourceFiles( sourceFilePaths );

	return typescriptProject;

}
