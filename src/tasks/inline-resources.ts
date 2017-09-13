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
					const result: string = inlineExternalResources( externalResourcesWithContent, fileContent, absoluteSourceFilePath );
					console.log( result );
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

function inlineExternalResources( externalResources: Array<any>, fileContent: string, filePath: string ): string {

	// const templateKeyDiff: number = 'template'.length - 'templateUrl'.length;
	// const styleKeyDiff: number = 'styles'.length - 'styleUrls'.length;
	let currentPositionCorrection: number = 0;
	const quotemark: string = '\'';
	return externalResources.reduce( ( newFileContent: string, externalResource: any ): string => {

		// Replace key
		newFileContent = replaceAt(
			newFileContent,
			externalResource.newKey,
			externalResource.node.getStart() + currentPositionCorrection,
			externalResource.node.getEnd() + currentPositionCorrection
		);
		currentPositionCorrection += externalResource.newKey.length - externalResource.oldKey.length;

		newFileContent = externalResource.urls.reduce( ( newFileContent: string, url: any ): string => {
			console.log( url.content );
			newFileContent = replaceAt(
				newFileContent,
				`${ quotemark }${ url.content }${ quotemark }`,
				url.node.getStart() + currentPositionCorrection,
				url.node.getEnd() + currentPositionCorrection
			);
			currentPositionCorrection += url.content.length - url.url.length;
			return newFileContent;
		}, newFileContent );

		return newFileContent;

	}, fileContent );

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
			preparedResource = resource.replace( /([\n\r]\s*)+/gm, '' ) // TODO: ...
			break;

		// External SASS files
		case 'scss':
			preparedResource = resource.replace( /([\n\r]\s*)+/gm, '' ) // TODO: ...
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
