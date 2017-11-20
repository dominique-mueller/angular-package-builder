import { posix as path } from 'path';

import { AngularPackageBuilderInternalConfig } from '../angular-package-builder-internal-config.interface';
import { AngularResourceAnalyzer, AngularResource, AngularResourceUrl } from '../angular-resource-analyzer/angular-resource-analyzer';
import { compileSass } from '../resources/compile-sass';
import { getFiles } from '../utilities/get-files';
import { importWithFs } from '../utilities/import-with-fs';
import { minifyCss } from '../resources/minify-css';
import { minifyHtml } from '../resources/minify-html';
import Logger from '../logger/logger';

let readFile: any;
let writeFile: any;

/**
 * Inline resources (HTML templates for now); this also copies files without resources as well as typing definitions files.
 */
export async function inlineResources( config: AngularPackageBuilderInternalConfig ): Promise<void> {

	readFile = ( await importWithFs( '../utilities/read-file' ) ).readFile;
	writeFile = ( await importWithFs( '../utilities/write-file' ) ).writeFile;

	// Get patterns for source files
	const sourceFilePatterns: Array<string> = [
		path.join( '**', '*.ts' ), // Includes source and typing files
		`!${ path.join( '**', '*.spec.ts' ) }`, // Exclude tests
		...config.ignored // Exclude ignored files & folders
	];
	Logger.debug( '' );
	Logger.debug( 'Patterns for source files:', sourceFilePatterns );
	Logger.debug( '' );

	// Get paths for source files
	const sourceFilePaths: Array<string> = await getFiles( sourceFilePatterns, config.entry.folder );
	Logger.debug( 'Found source files:', sourceFilePaths );
	Logger.debug( '' );

	// Inline resources into source files
	Logger.debug( 'Inline resources ...' );
	const logMessages: { [ sourceFilePath: string ]: Array<string> } = {};
	await Promise.all(
		sourceFilePaths.map( async( sourceFilePath: string ): Promise<void> => {

			// Read source file
			logMessages[ sourceFilePath ] = [];
			const absoluteSourceFilePath: string = path.join( config.entry.folder, sourceFilePath );
			const absoluteDestinationFilePath: string = path.join( config.temporary.prepared, sourceFilePath );
			logMessages[ sourceFilePath ].push( `Read source file from "${ absoluteSourceFilePath }"` );
			const fileContent: string = await readFile( absoluteSourceFilePath );

			// Find external resources
			const angularResourceAnalyzer: AngularResourceAnalyzer = new AngularResourceAnalyzer( absoluteSourceFilePath, fileContent );
			const externalResources: Array<AngularResource> = angularResourceAnalyzer.getExternalResources();
			const numberOfResourceFiles: number = externalResources.reduce(
				( numberOfResourceFiles: number, externalResource: AngularResource ): number => {
				return numberOfResourceFiles + externalResource.urls.length;
			}, 0 );
			const numberOfExternalTemplates: number = externalResources.reduce(
				( numberOfExternalTemplates: number, externalResource: AngularResource ): number => {
				return numberOfExternalTemplates + ( externalResource.oldKey === 'templateUrl' ? 1 : 0 );
			}, 0 );
			const numberOfExternalStyles: number = externalResources.reduce(
				( numberOfExternalStyles: number, externalResource: AngularResource ): number => {
				return numberOfExternalStyles + ( externalResource.oldKey === 'styleUrls' ? 1 : 0 );
			}, 0 );
			logMessages[ sourceFilePath ].push( [
				`Found ${ externalResources.length } external resources`,
				`(${ numberOfExternalTemplates } templates, ${ numberOfExternalStyles } stylesheets)`,
				`, total of ${ numberOfResourceFiles } files`
			].join() );

			// Load external resources
			const externalResourcesLoaded: Array<AngularResource> =
				await loadExternalResources( externalResources, absoluteSourceFilePath, logMessages[ sourceFilePath ] );

			// Inline external resources
			logMessages[ sourceFilePath ].push( `Inline external resources` );
			const fileContentWithInlinedResources: string = angularResourceAnalyzer.inlineExternalResources( externalResourcesLoaded );

			// Write file
			logMessages[ sourceFilePath ].push( `Write file to "${ absoluteDestinationFilePath }"` );
			await writeFile( absoluteDestinationFilePath, fileContentWithInlinedResources );

		} )
	);
	Object.keys( logMessages ).forEach( ( filePath: string ): void => {
		Logger.debug( `  Source file "${ filePath }"` );
		logMessages[ filePath ].forEach( ( logLine: string ): void => {
			Logger.debug( `    -> ${ logLine }` );
		} );
	} );
	Logger.debug( '' );

}

/**
 * Load all external resources
 */
async function loadExternalResources( externalResources: Array<AngularResource>, filePath: string, logMessages: Array<string> ):
	Promise<Array<AngularResource>> {

	return Promise.all(

		// Load all resources
		externalResources.map( async( externalResource: AngularResource ): Promise<AngularResource> => {
			externalResource.urls = await Promise.all(

				// Load all resource URLs
				externalResource.urls.map( async( url: AngularResourceUrl ): Promise<AngularResourceUrl> => {
					url.content = await loadAndPrepareExternalResource( url.url, filePath, logMessages );
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
async function loadAndPrepareExternalResource( resourceUrl: string, filePath: string, logMessages: Array<string> ): Promise<string> {

	// Read the resource file
	const resourcePath: string = path.join( path.dirname( filePath ), resourceUrl );
	let resource: string;
	try {
		resource = await readFile( resourcePath );
		logMessages.push( `Read external resource file from "${ resourcePath }"` );
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
			logMessages.push( 'Minify HTML resource' );
			resource = minifyHtml( resource );
			break;

		// External CSS files
		case 'css':
			logMessages.push( 'Minify CSS resource' );
			resource = minifyCss( resource );
			break;

		// External SASS files
		case 'scss':
		case 'sass':
			logMessages.push( 'Compile SASS resource' );
			resource = await compileSass( resource );
			logMessages.push( 'Minify SASS resource' );
			resource = minifyCss( resource );
			break;

	}

	return resource;

}
