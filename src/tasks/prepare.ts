import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from '../internal-config.interface';
import { AngularResource } from '../angular-resource-analyzer/angular-resource.interface';
import { AngularResourceAnalyzer } from '../angular-resource-analyzer/angular-resource-analyzer';
import { AngularResourceUrl } from '../angular-resource-analyzer/angular-resource-url.interface';
import { compileSass } from '../resources/compile-sass';
import { getFiles } from '../utilities/get-files';
import { minifyCss } from '../resources/minify-css';
import { minifyHtml } from '../resources/minify-html';
import { readFile } from '../utilities/read-file';
import { writeFile } from '../utilities/write-file';

/**
 * Prepare
 *
 * @param config - Internal configuration
 */
export async function prepare( config: AngularPackageBuilderInternalConfig ): Promise<void> {

	// Get source files
	const sourceFilePatterns: Array<string> = [
		path.join( '**', '*.ts' ), // Includes source and typing files
		`!${path.join( '**', '*.spec.ts' )}`, // Exclude tests
		...config.ignored // Exclude ignored files & folders
	];
	const sourceFilePaths: Array<string> = await getFiles( sourceFilePatterns, config.entry.folder );

	// Inline resources into source files
	await Promise.all(
		sourceFilePaths.map( async ( sourceFilePath: string ): Promise<void> => {

			// Read source file
			const absoluteSourceFilePath: string = path.join( config.entry.folder, sourceFilePath );
			const absoluteOutputFilePath: string = path.join( config.temporary.prepared, sourceFilePath );
			let sourceFileContent: string = await readFile( absoluteSourceFilePath );

			// Run transformers
			sourceFileContent = transformLineEndings( sourceFileContent );
			sourceFileContent = await transformResources( sourceFileContent, absoluteSourceFilePath );

			// Write file
			await writeFile( absoluteOutputFilePath, sourceFileContent );

		} )
	);

}

/**
 * Line ending transformer
 *
 * @param fileContent - File content
 */
function transformLineEndings( fileContent: string ): string {
	return fileContent.replace( /\r\n|\r|\n/g, '\n' ); // 'LF' all the way
}

/**
 * Resources transformer
 *
 * @param fileContent - File content
 * @param filePath    - File path (absolute)
 */
async function transformResources( fileContent: string, filePath: string ): Promise<string> {

	// Find external resources
	const angularResourceAnalyzer: AngularResourceAnalyzer = new AngularResourceAnalyzer( filePath, fileContent );
	let externalResources: Array<AngularResource> = angularResourceAnalyzer.findExternalResources();

	// Get external resources
	externalResources = await Promise.all(
		externalResources.map( async ( externalResource: AngularResource ): Promise<AngularResource> => {
			externalResource.urls = await Promise.all(
				externalResource.urls.map( async ( url: AngularResourceUrl ): Promise<AngularResourceUrl> => {
					url.content = await getPreparedExternalResource( url.url, filePath );
					return url;
				} )
			);
			return externalResource;
		} )
	);

	// Inline external resources
	return angularResourceAnalyzer.inlineExternalResources( externalResources );

}

/**
 * Load and prepare a external resource
 */
async function getPreparedExternalResource( resourceUrl: string, filePath: string ): Promise<string> {

	// Read the resource file
	const resourcePath: string = path.join( path.dirname( filePath ), resourceUrl );
	let resource: string;
	try {
		resource = await readFile( resourcePath );
	} catch ( error ) {
		throw new Error( [
			`The external resource at "${resourcePath}" does not exist, or cannot be read.`,
			error.message
		].join( '\n' ) );
	}

	// Prepare files, based on file type
	// Note: We minify to squash the resource into a single line, so that the sourcemaps don't break
	switch ( path.extname( resourceUrl ).substring( 1 ).toLowerCase() ) {
		case 'html':
			resource = minifyHtml( resource );
			break;
		case 'css':
			resource = minifyCss( resource );
			break;
		case 'scss':
		case 'sass':
			resource = await compileSass( resource );
			resource = minifyCss( resource );
			break;
	}

	return resource;

}
