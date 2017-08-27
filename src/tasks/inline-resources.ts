import * as path from 'path';

import * as globby from 'globby';

import { readFile } from './../utilities/read-file';
import { writeFile } from './../utilities/write-file';
import { cleanFolder } from './../utilities/clean-folder';
import { AngularPackageBuilderConfig } from './../../index';

/**
 * Step 1: Inline resources (HTML templates for now); this also copies files without resources as well as typing definitions files.
 *
 * @param config - Confguration
 */
export function inlineResources( config: AngularPackageBuilderConfig ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Clear the output folder first
		await cleanFolder( config.folders.temporary.inline);

		// Get all files
		const filePaths: Array<string> = await getTypeScriptSourceFiles( config.folders.entry );

		// Inline resources into source files, save changes into dist
		await Promise.all(
			filePaths.map( async( filePath: string ): Promise<string> => {

				// Get paths
				const fullPath: string = path.join( config.folders.entry, filePath );
				const fullDistPath: string = path.join( config.folders.temporary.inline , filePath );

				// Inline resources
				const fileContent: string = await readFile( fullPath );
				const fileContentInlined: string = await inlineTemplate( fullPath, fileContent );
				await writeFile( fullDistPath, fileContentInlined );

				return filePath;

			} )
		);

		resolve();

	} );
}

/**
 * Get all TypeScript source files (thus, not the unit tests)
 *
 * @param   entryFolder - Entry folder path
 * @returns             - List of TypeScript source files
 */
function getTypeScriptSourceFiles( entryFolder: string ): Promise<Array<string>> {

	// Get files, using the entry folder as base (so we can easily keep the directory structure in the dist folder)
	// TODO: Read in gitignore??
	return globby( [
		path.join( '**', '*.ts' ), // Get all source files
		`!${ path.join( '**', '*.spec.ts' ) }`, // Ignore unit tests
		`!${ path.join( 'node_modules', '**' ) }` // ignore dependencies
	], {
		cwd: entryFolder
	} );

}

/**
 * Inline HTML templates
 *
 * @param   filePath    - File path
 * @param   fileContent - File content
 * @returns             - File content with inlined resources
 */
function inlineTemplate( filePath: string, fileContent: string ): Promise<string> {
	return new Promise<string>( async( resolve: ( newFileContent: string ) => void, reject: ( error: Error ) => void ) => {

		// Do not mutate the incoming parameter directly
		let newFileContent: string = fileContent;

		// Regular expression for finding external template references
		const externalTemplateRegExp: RegExp = /templateUrl:\s*'([^']+?\.html)'/g;

		// Retrieve all template paths (while not updating the file content though)
		const templatePaths: Array<string> = [];
		newFileContent.replace( externalTemplateRegExp, ( match: string, templateUrl: string ): string => {
			templatePaths.push( templateUrl );
			return templateUrl;
		} );

		// Only inline resources if necessary
		if ( templatePaths.length > 0 ) {

			// Load the templates
			const templateFilesContent: { [ templatePath: string ]: string } =

				// Pre-load all template asynchronously
				( await Promise.all(

					// Map template paths to their content
					templatePaths.map( async( templatePath: string ): Promise<string> => {

						// Read the template file
						const templateFilePath: string = path.join( path.dirname( filePath ), templatePath );
						const templateFileContent: string = await readFile( templateFilePath );

						// Optimize the template file content
						const optimizedTemplateFileContent: string = templateFileContent // TODO: Minify HTML for real?
							.replace( /([\n\r]\s*)+/gm, '' ); // Pretty much minifies the file

						return optimizedTemplateFileContent;

					} )
				) )

				// Convert array into object
				.reduce( ( templateFilesContent: any, templateFileContent: string, index: number ): { [ templatePath: string ]: string } => {
					templateFilesContent[ templatePaths[ index ] ] = templateFileContent; // Index works because the order stays the same
					return templateFilesContent;
				}, {} );

			// Replace external template reference with inline template
			newFileContent = newFileContent.replace( externalTemplateRegExp, ( match: string, templateUrl: string ): string => {
				return `template: '${ templateFilesContent[ templateUrl ] }'`;
			} );

		}

		resolve( newFileContent );

	} );
}
