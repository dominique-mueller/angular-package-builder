import * as path from 'path';

import * as CleanCSS from 'clean-css';
import * as htmlMinifier from 'html-minifier';
import * as sass from 'node-sass';
import * as typescript from 'typescript';

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

				// Read file
				const absoluteSourceFilePath: string = path.join( config.entry.folder, filePath );
				const absoluteDestinationFilePath: string = path.join( config.temporary.prepared, filePath );
				let fileContent: string = await readFile( absoluteSourceFilePath );

				// Find resources
				const angularResourceAnalyzer: AngularResourceAnalyzer = new AngularResourceAnalyzer( absoluteSourceFilePath, fileContent );
				const externalResources: Array<any> = angularResourceAnalyzer.analyze();

				// Inline resources
				if ( externalResources.length > 0 ) {
					const externalResourcesWithContent: Array<any> = await loadExternalResources( externalResources, absoluteSourceFilePath );
					fileContent = inlineExternalResources( externalResourcesWithContent, fileContent, absoluteSourceFilePath );
				}

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
 * Inline external resources into the source file
 */
function inlineExternalResources( externalResources: Array<any>, fileContent: string, filePath: string ): string {

	let currentPositionCorrection: number = 0;
	return externalResources.reduce( ( newFileContent: string, externalResource: any ): string => {

		// Replace key
		newFileContent = replaceAt( newFileContent, externalResource.newKey, externalResource.node, currentPositionCorrection );
		currentPositionCorrection += externalResource.newKey.length - externalResource.oldKey.length;

		// Replace value(s)
		newFileContent = externalResource.urls.reduce( ( newFileContent: string, url: any ): string => {
			newFileContent = replaceAt( newFileContent, `\`${ url.content }\``, url.node, currentPositionCorrection );
			currentPositionCorrection += url.content.length - url.url.length;
			return newFileContent;
		}, newFileContent );

		return newFileContent;

	}, fileContent );

}

/**
 * Load all external resources
 */
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
 * Load and prepare a external resource
 */
async function loadExternalResource( resourceUrl: string, filePath: string ): Promise<string> {

	// Read the resource file
	const absoluteTemplatePath: string = path.join( path.dirname( filePath ), resourceUrl );
	let resource: string = await readFile( absoluteTemplatePath );

	// Prepare files, based on file type
	const fileType: string = path.extname( resourceUrl ).substring( 1 );
	switch ( fileType ) {

		// External HTML templates
		case 'html':
			resource = minifyHtml( resource );
			break;

		// External CSS files
		case 'css':
			resource = minifyCss( resource );
			break;

		// External SASS files
		case 'scss':
			resource = await compileSass( resource );
			resource = minifyCss( resource );
			break;

		// Unknown resource types
		default:
			throw new Error( 'Unsupported external resource.' );

	}

	return resource;

}

function minifyHtml( htmlContent: string ): string {
	return htmlMinifier.minify( htmlContent, htmlMinifierConfig );
}

function minifyCss( cssContent: string ): string {

	const result: any = new CleanCSS( {
		level: 0 // No optimization
	} ).minify( cssContent );

	return result.styles;

}

function compileSass( sassContent: string ): Promise<string> {
	return new Promise<string>( ( resolve: ( cssContent: string ) => void, reject: ( error: Error ) => void ) => {

		// Compile SASS into CSS
		sass.render( {
			data: sassContent,
			outputStyle: 'expanded' // We will minify later on
		}, ( error: Error, sassRenderResult: any ) => {

			resolve( sassRenderResult.css.toString() );

		} );

	} );
}

/**
 * Replace part of a string, based on a node and a additional position correction
 * TODO: Move into analyzer?
 */
function replaceAt( fullContent: string, replacement: string, node: typescript.Node, positionCorrection: number = 0 ): string {
	return [
		fullContent.substring( 0, node.getStart() + positionCorrection ),
		replacement,
		fullContent.substring( node.getEnd() + positionCorrection, fullContent.length )
	].join( '' );
}
