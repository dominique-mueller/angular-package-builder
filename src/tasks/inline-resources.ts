import * as path from 'path';

import * as fsExtra from 'fs-extra';
import * as globby from 'globby';

import { readFile } from './../utilities/read-file';
import { writeFile } from './../utilities/write-file';
import { cleanFolder } from './../utilities/clean-folder';

const entryPath: string = 'example-library/lib';

export function inlineResources( source: string, destination: string ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		await cleanFolder( path.join( 'dist', 'inlined' ) );

		const filePaths: Array<string> = await getTypeScriptSourceFiles();

		await Promise.all(

			// Map template paths to their content
			filePaths.map( async( filePath: string ): Promise<string> => {
				await inlineResource( filePath );
				return filePath;
			} )
		);

		resolve();

	} );
}

function getTypeScriptSourceFiles(): Promise<Array<string>> {

	// TODO: Read from gitignore
	return globby( [
		path.join( '**', '*.ts' ),
		`!${ path.join( '**', '*.spec.ts' ) }`,
		`!${ path.join( 'node_modules', '**' ) }`
	], {
		cwd: entryPath
	} );

}

function inlineResource( filePath: string ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		const fullPath: string = path.join( entryPath, filePath );
		const fullDistPath: string = path.join( 'dist', 'inlined', filePath );

		let fileContent: string = await readFile( fullPath );
		fileContent = await inlineTemplate( fullPath, fileContent );
		await writeFile( fullDistPath, fileContent );

		resolve();

	} );
}

function inlineTemplate( filePath: string, fileContent: string ): Promise<string> {
	return new Promise<string>( async( resolve: ( inlinedFileContent: string ) => void, reject: ( error: Error ) => void ) => {

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
