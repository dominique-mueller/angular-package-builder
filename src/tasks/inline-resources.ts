import * as path from 'path';

import * as htmlMinifier from 'html-minifier';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { dynamicImport } from './../utilities/dynamic-import';
import { getFiles } from './../utilities/get-files';
import { htmlMinifierConfig } from './../config/html-minifier.config';
import { MemoryFileSystem } from './../memory-file-system';
import { normalizeLineEndings } from './../utilities/normalize-line-endings';
import { readFile } from './../utilities/read-file';
import { AngularResourceAnalyzer } from './../angular-resource-analyzer';

/**
 * Inline resources (HTML templates for now); this also copies files without resources as well as typing definitions files.
 */
export function inlineResources( config: AngularPackageBuilderInternalConfig, memoryFileSystem: MemoryFileSystem | null ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Import
		const writeFile = ( await dynamicImport( './../utilities/write-file', memoryFileSystem ) ).writeFile;

		// Get all files
		// TODO: Exit with error if there are no files?
		const sourceFilesPatterns: Array<string> = [
			path.join( '**', '*.ts' ), // Includes typing files
			`!${ path.join( '**', '*.spec.ts' ) }`,
			...config.ignored
		];
		const filePaths: Array<string> = await getFiles( sourceFilesPatterns, config.entry.folder );

		// Inline resources into source files, save changes into dist
		await Promise.all(
			filePaths.map( async( filePath: string ): Promise<void> => {

				// Get paths
				const absoluteSourceFilePath: string = path.join( config.entry.folder, filePath );
				const absoluteDestinationFilePath: string = path.join( config.temporary.prepared, filePath );

				// Inline resources
				let fileContent: string = await readFile( absoluteSourceFilePath );
				const angularResourceAnalyzer: AngularResourceAnalyzer = new AngularResourceAnalyzer( absoluteSourceFilePath, fileContent );
				const externalResources: Array<any> = angularResourceAnalyzer.analyze();

				console.log( externalResources );

				const externalTemplates: Array<any> = externalResources
					.filter( ( externalResource: any ) => {
						return externalResource.type === 'template';
					} );

				if ( externalTemplates.length > 0 ) {
					fileContent = await inlineTemplates( absoluteSourceFilePath, fileContent, externalTemplates );
				}

				// fileContent = await inlineTemplate( absoluteSourceFilePath, fileContent );
				// TODO: Inline styles

				// We have to normalize line endings here (to LF) because of an OS compatibility issue in tsickle
				// See <https://github.com/angular/tsickle/issues/596> for further details.
				// fileContent = normalizeLineEndings( fileContent );

				// await writeFile( absoluteDestinationFilePath, fileContent );

			} )
		);

		resolve();

	} );
}

function inlineTemplates( filePath: string, fileContent: string, externalTemplates: Array<any> ): Promise<string> {
	return new Promise<string>( async( resolve: ( fileContent: string ) => void, reject: ( error: Error ) => void ) => {

		const externalTemplatesWithContent: Array<any> = await Promise.all(
			externalTemplates.map( async( externalResource: any ): Promise<void> => {

				// Read the template file
				const absoluteTemplatePath: string = path.join( path.dirname( filePath ), externalResource.urls[ 0 ].url );
				const template: string = await readFile( absoluteTemplatePath );

				// Optimize the template file content
				const minifiedTemplate: string = <string> htmlMinifier.minify( template, htmlMinifierConfig );

				externalResource.content = `'${ minifiedTemplate }'`;
				return externalResource;

			} )
		)

		// const templateUrlLength: number = 'templateUrl'.length;
		// const templateKeyDiff: number = templateUrlLength - 'template'.length;
		let diffCounter: number = 0;
		externalTemplatesWithContent.reduce( ( newFileContent: string, externalTemplate: any ) => {

			// Get the interesting part of the file
			// let inlineTemplate: string = fileContent.substring( externalTemplate.start, externalTemplate.end );

			newFileContent = replaceAt( newFileContent, 'template', externalTemplate.key.start + diffCounter, externalTemplate.key.end + diffCounter );
			diffCounter += -3;
			console.log( newFileContent );

			newFileContent = replaceAt( newFileContent, externalTemplate.content, externalTemplate.urls[ 0 ].start + diffCounter, externalTemplate.urls[ 0 ].end + diffCounter )
			diffCounter += externalTemplate.content.length - externalTemplate.urls[ 0 ].url.length;
			console.log( newFileContent );

		}, fileContent );

		// console.log( externalTemplatesWithContent );

	} );
}

function replaceAt( fullContent: string, replacement: string, start: number, end: number ): string {
	return `${ fullContent.substring( 0, start )}${ replacement }${ fullContent.substring( end, fullContent.length ) }`;
}




/**
 * Inline HTML templates
 *
 * @param   filePath    - File path
 * @param   fileContent - File content
 * @returns             - File content with inlined resources
 */
// function inlineTemplate( filePath: string, fileContent: string ): Promise<string> {
// 	return new Promise<string>( async( resolve: ( fileContent: string ) => void, reject: ( error: Error ) => void ) => {

// 		let newFileContent: string = fileContent;
// 		const externalTemplateRegExp: RegExp = /templateUrl:\s*'([^']+?\.html)'/g;

// 		// Retrieve all template file paths (while not updating the file content)
// 		const templatePaths: Array<string> = [];
// 		newFileContent.replace( externalTemplateRegExp, ( match: string, templateUrl: string ): string => {
// 			templatePaths.push( templateUrl );
// 			return templateUrl; // Don't change anythin
// 		} );

// 		// Only inline resources if necessary
// 		if ( templatePaths.length > 0 ) {

// 			// Read all template files
// 			const templates: Array<string> = await Promise.all(

// 				// Map template paths to their content
// 				templatePaths.map( async( templatePath: string ): Promise<string> => {

// 					// Read the template file
// 					const absoluteTemplatePath: string = path.join( path.dirname( filePath ), templatePath );
// 					const template: string = await readFile( absoluteTemplatePath );

// 					// Optimize the template file content
// 					const minifiedTemplate: string = minifyHTML( template );

// 					return minifiedTemplate;

// 				} )
// 			);

// 			// Load the templates
// 			const filesWithTemplates: { [ file: string ]: string } = templates
// 				.reduce( ( filesWithTemplates: { [ file: string ]: string }, template: string, index: number ):
// 					{ [ templatePath: string ]: string } => {

// 					filesWithTemplates[ templatePaths[ index ] ] = template; // Index works because the order stays the same
// 					return filesWithTemplates;

// 				}, {} );

// 			// Replace external template reference with inline template
// 			newFileContent = newFileContent.replace( externalTemplateRegExp, ( match: string, templateUrl: string ): string => {
// 				return `template: '${ filesWithTemplates[ templateUrl ] }'`;
// 			} );

// 		}

// 		resolve( newFileContent );

// 	} );
// }
