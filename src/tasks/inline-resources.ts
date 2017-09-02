import * as path from 'path';

import * as globby from 'globby';

import { AngularPackageBuilderConfig } from './../../index';
import { cleanFolder } from './../utilities/clean-folder';
import { normalizeLineEndings } from './../utilities/normalize-line-endings';
import { readFile } from './../utilities/read-file';
import { writeFile } from './../utilities/write-file';

/**
 * Inline resources (HTML templates for now); this also copies files without resources as well as typing definitions files.
 */
export function inlineResources( sourcePath: string, destinationPath: string ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Clear the output folder first
		await cleanFolder( destinationPath );

		// Get all files
		// TODO: Exit with error if there are no files?
		const filePaths: Array<string> = await getTypeScriptSourceFiles( sourcePath );

		// Inline resources into source files, save changes into dist
		await Promise.all(
			filePaths.map( async( filePath: string ): Promise<string> => {

				// Get paths
				const absoluteSourceFilePath: string = path.join( sourcePath, filePath );
				const absoluteDestinationFilePath: string = path.join( destinationPath, filePath );

				// Inline resources
				let fileContent: string = await readFile( absoluteSourceFilePath );
				fileContent = await inlineTemplate( absoluteSourceFilePath, fileContent );
				// TODO: Inline styles

				// We have to normalize line endings here (to LF) because of an OS compatibility issue in tsickle
				// See <https://github.com/angular/tsickle/issues/596> for further details.
				fileContent = normalizeLineEndings( fileContent );

				await writeFile( absoluteDestinationFilePath, fileContent );

				return filePath;

			} )
		);

		resolve();

	} );
}

/**
 * Get all TypeScript source files (thus, not the unit tests)
 *
 * @param   basePath - Base folder path
 * @returns          - List of TypeScript source files
 */
function getTypeScriptSourceFiles( basePath: string ): Promise<Array<string>> {

	// Get files, using the entry folder as base (so we can easily keep the directory structure in the dist folder)
	// TODO: Read folder / files to be ignored from gitignore file?
	return globby( [
		path.join( '**', '*.ts' ), // Get all source files
		`!${ path.join( '**', '*.spec.ts' ) }`, // Ignore unit tests
		`!${ path.join( 'node_modules', '**' ) }` // Ignore dependencies
	], {
		cwd: basePath
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
	return new Promise<string>( async( resolve: ( fileContent: string ) => void, reject: ( error: Error ) => void ) => {

		let newFileContent: string = fileContent;
		const externalTemplateRegExp: RegExp = /templateUrl:\s*'([^']+?\.html)'/g;

		// Retrieve all template file paths (while not updating the file content)
		const templatePaths: Array<string> = [];
		newFileContent.replace( externalTemplateRegExp, ( match: string, templateUrl: string ): string => {
			templatePaths.push( templateUrl );
			return templateUrl; // Don't change anythin
		} );

		// Only inline resources if necessary
		if ( templatePaths.length > 0 ) {

			// Read all template files
			const templates: Array<string> = await Promise.all(

				// Map template paths to their content
				templatePaths.map( async( templatePath: string ): Promise<string> => {

					// Read the template file
					const absoluteTemplatePath: string = path.join( path.dirname( filePath ), templatePath );
					const template: string = await readFile( absoluteTemplatePath );

					// Optimize the template file content
					// TODO: Minify HTML for real? Or handle sourcemaps correctly?
					const minifiedTemplate: string = template.replace( /([\n\r]\s*)+/gm, '' );

					return minifiedTemplate;

				} )
			);

			// Load the templates
			const filesWithTemplates: { [ file: string ]: string } = templates
				.reduce( ( filesWithTemplates: { [ file: string ]: string }, template: string, index: number ):
					{ [ templatePath: string ]: string } => {

					filesWithTemplates[ templatePaths[ index ] ] = template; // Index works because the order stays the same
					return filesWithTemplates;

				}, {} );

			// Replace external template reference with inline template
			newFileContent = newFileContent.replace( externalTemplateRegExp, ( match: string, templateUrl: string ): string => {
				return `template: '${ filesWithTemplates[ templateUrl ] }'`;
			} );

		}

		resolve( newFileContent );

	} );
}
