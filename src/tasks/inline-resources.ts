import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { AngularResourceAnalyzer, AngularResource, AngularResourceUrl } from './../angular-resource-analyzer/angular-resource-analyzer';
import { compileSass } from './../resources/compile-sass';
import { getFiles } from './../utilities/get-files';
import { htmlMinifierConfig } from './../config/html-minifier.config';
import { importWithFs } from './../utilities/import-with-fs';
import { minifyCss } from './../resources/minify-css';
import { minifyHtml } from './../resources/minify-html';

let readFile: any;
let writeFile: any;

/**
 * Inline resources (HTML templates for now); this also copies files without resources as well as typing definitions files.
 */
export async function inlineResources( config: AngularPackageBuilderInternalConfig ): Promise<void> {

	readFile = ( await importWithFs( './../utilities/read-file' ) ).readFile;
	writeFile = ( await importWithFs( './../utilities/write-file' ) ).writeFile;

	// Get all files
	const sourceFilesPatterns: Array<string> = [
		path.join( '**', '*.ts' ), // Includes source and typing files
		`!${ path.join( '**', '*.spec.ts' ) }`, // Exclude tests
		...config.ignored
	];
	const filePaths: Array<string> = await getFiles( sourceFilesPatterns, config.entry.folder );

	// Inline resources into source files
	await Promise.all(
		filePaths.map( async( filePath: string ): Promise<void> => {

			// Read file
			const absoluteSourceFilePath: string = path.join( config.entry.folder, filePath );
			const absoluteDestinationFilePath: string = path.join( config.temporary.prepared, filePath );
			const fileContent: string = await readFile( absoluteSourceFilePath );

			// Find external resources
			const angularResourceAnalyzer: AngularResourceAnalyzer = new AngularResourceAnalyzer( absoluteSourceFilePath, fileContent );
			const externalResources: Array<AngularResource> = angularResourceAnalyzer.getExternalResources();

			// Load external resources
			const externalResourcesLoaded: Array<AngularResource> = await loadExternalResources( externalResources, absoluteSourceFilePath );

			// Inline external resources
			const fileContentWithInlinedResources: string = angularResourceAnalyzer.inlineExternalResources( externalResourcesLoaded );

			// Write file
			await writeFile( absoluteDestinationFilePath, fileContentWithInlinedResources );

		} )
	);

}

/**
 * Load all external resources
 */
async function loadExternalResources( externalResources: Array<AngularResource>, filePath: string ): Promise<Array<AngularResource>> {

	return Promise.all(

		// Load all resources
		externalResources.map( async( externalResource: AngularResource ): Promise<AngularResource> => {
			externalResource.urls = await Promise.all(

				// Load all resource URLs
				externalResource.urls.map( async( url: AngularResourceUrl ): Promise<AngularResourceUrl> => {
					url.content = await loadAndPrepareExternalResource( url.url, filePath );
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
async function loadAndPrepareExternalResource( resourceUrl: string, filePath: string ): Promise<string> {

	// Read the resource file
	const resourcePath: string = path.join( path.dirname( filePath ), resourceUrl );
	let resource: string;
	try {
		resource = await readFile( resourcePath );
	} catch( error ) {
		throw new Error( [
			`The external resource at "${ resourcePath }" does not exist, or cannot be read.`,
			error.message
		].join( '\n' ) );
	}

	// Prepare files, based on file type
	// Note: We minify to squash the resource into a single line, so that the sourcemaps don't break
	const fileType: string = path.extname( resourceUrl ).substring( 1 ).toLowerCase();
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
		case 'sass':
			resource = await compileSass( resource );
			resource = minifyCss( resource );
			break;

	}

	return resource;

}
