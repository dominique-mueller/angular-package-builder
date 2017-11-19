import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { AngularResourceAnalyzer, AngularResource, AngularResourceUrl } from './../angular-resource-analyzer/angular-resource-analyzer';
import { compileSass } from './../resources/compile-sass';
import { getFiles } from './../utilities/get-files';
import { htmlMinifierConfig } from './../config/html-minifier.config';
import { importWithFs } from './../utilities/import-with-fs';
import { minifyCss } from './../resources/minify-css';
import { minifyHtml } from './../resources/minify-html';
import Logger from '../logger/logger';

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
	Logger.debug( 'Patterns for finding source files:' );
	Logger.debug( sourceFilesPatterns );
	Logger.debug( '' );
	Logger.debug( 'Found source files (relative path):' );
	Logger.debug( filePaths );
	Logger.debug( '' );

	// Inline resources into source files
	const logLines: any = {};
	Logger.debug( 'Inline resources' );
	await Promise.all(
		filePaths.map( async( filePath: string ): Promise<void> => {

			// Read file
			logLines[ filePath ] = [];
			const absoluteSourceFilePath: string = path.join( config.entry.folder, filePath );
			const absoluteDestinationFilePath: string = path.join( config.temporary.prepared, filePath );
			logLines[ filePath ].push( `Read file at "${ absoluteSourceFilePath }"` );
			const fileContent: string = await readFile( absoluteSourceFilePath );

			// Find external resources
			const angularResourceAnalyzer: AngularResourceAnalyzer = new AngularResourceAnalyzer( absoluteSourceFilePath, fileContent );
			const externalResources: Array<AngularResource> = angularResourceAnalyzer.getExternalResources();
			const numberOfResourceFiles: number = externalResources.reduce(
				( numberOfResourceFiles: number, externalResource: AngularResource ): number => {
				return numberOfResourceFiles + externalResource.urls.length;
			}, 0 );
			logLines[ filePath ].push( `Found ${ externalResources.length } external resources, total of ${ numberOfResourceFiles } files` );

			// Load external resources
			const externalResourcesLoaded: Array<AngularResource> =
				await loadExternalResources( externalResources, absoluteSourceFilePath, logLines[ filePath ] );

			// Inline external resources
			logLines[ filePath ].push( `Inline loaded resources` );
			const fileContentWithInlinedResources: string = angularResourceAnalyzer.inlineExternalResources( externalResourcesLoaded );

			// Write file
			logLines[ filePath ].push( `Write file to "${ absoluteDestinationFilePath }"` );
			await writeFile( absoluteDestinationFilePath, fileContentWithInlinedResources );

		} )
	);
	Object.keys( logLines ).forEach( ( filePath: string ): void => {
		Logger.debug( `  "${ filePath }"` );
		logLines[ filePath ].forEach( ( logLine: string ): void => {
			Logger.debug( `    -> ${ logLine }` );
		} );
	} );

}

/**
 * Load all external resources
 */
async function loadExternalResources( externalResources: Array<AngularResource>, filePath: string, logLine: any ): Promise<Array<AngularResource>> {

	return Promise.all(

		// Load all resources
		externalResources.map( async( externalResource: AngularResource ): Promise<AngularResource> => {
			externalResource.urls = await Promise.all(

				// Load all resource URLs
				externalResource.urls.map( async( url: AngularResourceUrl ): Promise<AngularResourceUrl> => {
					url.content = await loadAndPrepareExternalResource( url.url, filePath, logLine );
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
async function loadAndPrepareExternalResource( resourceUrl: string, filePath: string, logLine: any ): Promise<string> {

	// Read the resource file
	const resourcePath: string = path.join( path.dirname( filePath ), resourceUrl );
	let resource: string;
	try {
		resource = await readFile( resourcePath );
		logLine.push( `Read external resource from "${ resourcePath }"` );
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
			logLine.push( 'Minify HTML resource' );
			resource = minifyHtml( resource );
			break;

		// External CSS files
		case 'css':
			logLine.push( 'Minify CSS resource' );
			resource = minifyCss( resource );
			break;

		// External SASS files
		case 'scss':
		case 'sass':
			logLine.push( 'Compile SASS resource' );
			resource = await compileSass( resource );
			resource = minifyCss( resource );
			break;

	}

	return resource;

}
