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

		// Inline resources into source files
		await Promise.all(
			filePaths.map( async( filePath: string ): Promise<void> => {

				// Get paths
				const absoluteSourceFilePath: string = path.join( config.entry.folder, filePath );
				const absoluteDestinationFilePath: string = path.join( config.temporary.prepared, filePath );

				// Inline resources
				let fileContent: string = await readFile( absoluteSourceFilePath );
				const angularResourceAnalyzer: AngularResourceAnalyzer = new AngularResourceAnalyzer( absoluteSourceFilePath, fileContent );
				const externalResources: Array<any> = angularResourceAnalyzer.analyze();

				// TODO: Validate that resource endings are known!!

				if ( externalResources.length > 0 ) {
					// console.log( 'BEFORE' );
					// console.log( externalResources );
					// console.log( '' );
					// console.log( '--------------------------------------' );
					// console.log( '' );
					const externalResourcesWithContent: Array<any> = await loadExternalResources( externalResources, absoluteSourceFilePath );
					const result: any = await inlineResources( externalResourcesWithContent, fileContent, absoluteSourceFilePath );
					// console.log( 'AFTER' );
					// console.log( test );

				}

				// We have to normalize line endings here (to LF) because of an OS compatibility issue in tsickle
				// See <https://github.com/angular/tsickle/issues/596> for further details.
				// fileContent = normalizeLineEndings( fileContent );

				// await writeFile( absoluteDestinationFilePath, fileContent );

			} )
		);

		resolve();

	} );
}

function inlineResources( externalResources: Array<any>, fileContent: string, filePath: string ): Promise<string> {
	return new Promise<string>( async( resolve: ( fileContent: string ) => void, reject: ( error: Error ) => void ) => {

		// const templateKeyDiff: number = 'template'.length - 'templateUrl'.length;
		// let diffCounter: number = 0;
		// const newFileContent: string = externalTemplatesWithContent.reduce( ( newFileContent: string, externalTemplate: any ) => {

		// 	newFileContent = replaceAt( newFileContent, 'template', externalTemplate.key.start + diffCounter, externalTemplate.key.end + diffCounter );
		// 	diffCounter += templateKeyDiff;
		// 	// console.log( newFileContent );

		// 	newFileContent = replaceAt( newFileContent, externalTemplate.content, externalTemplate.urls[ 0 ].start + diffCounter, externalTemplate.urls[ 0 ].end + diffCounter )
		// 	diffCounter += externalTemplate.content.length - externalTemplate.urls[ 0 ].url.length;
		// 	// console.log( newFileContent );

		// }, fileContent );

		// resolve( newFileContent );

	} );
}

async function loadExternalResources( externalResources: Array<any>, filePath: string ): Promise<Array<any>> {

	return Promise.all(
		externalResources.map( async( externalResource: any ): Promise<any> => {
			externalResource.urls = await Promise.all(
				externalResource.urls.map( async( url: any ): Promise<any> => {
					url.content = await loadExternalResource( url.url, filePath );
					return url;
				} )
			);
			return externalResource;
		} )
	);

}

/**
 * Load external template
 */
async function loadExternalResource( resourceUrl: string, filePath: string ): Promise<string> {

	// Read the resource file
	const absoluteTemplatePath: string = path.join( path.dirname( filePath ), resourceUrl );
	const resource: string = await readFile( absoluteTemplatePath );

	// Prepare files, based on file type
	const fileType: string = path.extname( resourceUrl ).substring( 1 );
	let preparedResource: string;
	switch ( fileType ) {

		// External HTML templates
		case 'html':
			preparedResource = htmlMinifier.minify( resource, htmlMinifierConfig );
			break;

		// External CSS files
		case 'css':
			preparedResource = resource.replace( '\n\r', ' ' ); // TODO: ...
			break;

		// External SASS files
		case 'scss':
			preparedResource = resource.replace( '\n\r', ' ' ); // TODO: ...
			break;

		// TODO: What about .sass or .less??

		// Unknown resource types
		default:
			throw new Error( 'Unsupported external resource.' );

	}

	return preparedResource;

}

// TODO: Move into analyzer, pass node instead of start + end
function replaceAt( fullContent: string, replacement: string, start: number, end: number ): string {
	return `${ fullContent.substring( 0, start )}${ replacement }${ fullContent.substring( end, fullContent.length ) }`;
}
