import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { AngularResourceAnalyzer, AngularResource, AngularResourceUrl } from './../angular-resource-analyzer/angular-resource-analyzer';
import { compileSass } from './../resources/compile-sass';
import { dynamicImport } from './../utilities/dynamic-import';
import { getFiles } from './../utilities/get-files';
import { htmlMinifierConfig } from './../config/html-minifier.config';
import { minifyCss } from './../resources/minify-css';
import { minifyHtml } from './../resources/minify-html';
import { normalizeLineEndings } from './../utilities/normalize-line-endings';
import { readFile } from './../utilities/read-file';

/**
 * Inline resources (HTML templates for now); this also copies files without resources as well as typing definitions files.
 */
export async function inlineResources( config: AngularPackageBuilderInternalConfig ): Promise<void> {

	// Import
	const { writeFile } = await dynamicImport( './../utilities/write-file', config.memoryFileSystem );

	// Get all files
	// TODO: Exit with error if there are no files?
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
			let fileContent: string = await readFile( absoluteSourceFilePath );

			// Find and inline resources
			const angularResourceAnalyzer: AngularResourceAnalyzer = new AngularResourceAnalyzer( absoluteSourceFilePath, fileContent );
			const externalResources: Array<AngularResource> = angularResourceAnalyzer.getExternalResources();

			// Inline resources
			if ( externalResources.length > 0 ) {
				const externalResourcesWithContent: Array<AngularResource> =
					await loadExternalResources( externalResources, absoluteSourceFilePath );
				fileContent = angularResourceAnalyzer.inlineExternalResources( externalResourcesWithContent );
			}

			// We have to normalize line endings here (to LF) because of an OS compatibility issue in tsickle
			// See <https://github.com/angular/tsickle/issues/596> for further details.
			fileContent = normalizeLineEndings( fileContent );

			// Write file
			await writeFile( absoluteDestinationFilePath, fileContent );

		} )
	);

}

/**
 * Load all external resources
 */
async function loadExternalResources( externalResources: Array<AngularResource>, filePath: string ): Promise<Array<AngularResource>> {

	return Promise.all(
		externalResources.map( async( externalResource: AngularResource ): Promise<AngularResource> => {
			externalResource.urls = await Promise.all(
				externalResource.urls.map( async( url: AngularResourceUrl ): Promise<AngularResourceUrl> => {
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
			resource = await compileSass( resource );
			resource = minifyCss( resource );
			break;

		// Unknown resource types
		default:
			throw new Error( 'Unsupported external resource.' );

	}

	return resource;

}
