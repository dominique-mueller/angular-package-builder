import * as path from 'path';

import * as globby from 'globby';
import * as htmlMinifier from 'html-minifier';
import { AngularPackageBuilderConfig } from './../../index';
import { dynamicImport } from './../utilities/dynamic-import';
import { getFiles } from './../utilities/get-files';
import { htmlMinifierConfig } from './../config/html-minifier.config';
import { MemoryFileSystem } from './../memory-file-system';
import { normalizeLineEndings } from './../utilities/normalize-line-endings';
import { readFile } from './../utilities/read-file';

/**
 * Inline resources (HTML templates for now); this also copies files without resources as well as typing definitions files.
 */
export function inlineResources( config: AngularPackageBuilderConfig, memoryFileSystem: MemoryFileSystem | null ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Import
		const writeFile = ( await dynamicImport( './../utilities/write-file', memoryFileSystem ) ).writeFile;

		// Get all files
		// TODO: Exit with error if there are no files?
		const filePatterns: Array<string> = [
			path.join( '**', '*.ts' ), // Includes typing files
			`!${ path.join( '**', '*.spec.ts' ) }`
		];
		const filePaths: Array<string> = await getFiles( filePatterns, config.entry.folder );

		// Inline resources into source files, save changes into dist
		await Promise.all(
			filePaths.map( async( filePath: string ): Promise<void> => {

				// Get paths
				const absoluteSourceFilePath: string = path.join( config.entry.folder, filePath );
				const absoluteDestinationFilePath: string = path.join( config.temporary.prepared, filePath );

				// Inline resources
				let fileContent: string = await readFile( absoluteSourceFilePath );
				fileContent = await inlineTemplate( absoluteSourceFilePath, fileContent );
				// TODO: Inline styles

				// We have to normalize line endings here (to LF) because of an OS compatibility issue in tsickle
				// See <https://github.com/angular/tsickle/issues/596> for further details.
				fileContent = normalizeLineEndings( fileContent );

				await writeFile( absoluteDestinationFilePath, fileContent );

			} )
		);

		resolve();

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
					const minifiedTemplate: string = minifyHTML( template );

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

/**
 * Minify HTML
 */
function minifyHTML( content: string ): string {
	return <string> htmlMinifier.minify( content, htmlMinifierConfig );
}
