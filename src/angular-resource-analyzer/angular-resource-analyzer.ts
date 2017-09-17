import * as fs from 'fs';
import * as path from 'path';

import * as typescript from 'typescript';

import { AngularResource } from './angular-resource.interface';
import { AngularResourceUrl } from './angular-resource-url.interface';

export { AngularResource } from './angular-resource.interface';
export { AngularResourceUrl } from './angular-resource-url.interface';

/**
 * Angular Resource Analyzer
 */
export class AngularResourceAnalyzer {

	/**
	 * List of found external resources
	 */
	private externalResources: Array<AngularResource>;

	/**
	 * Relative path of the file to be tested
	 */
	private readonly filePath: string;

	/**
	 * File name
	 */
	private readonly fileName: string;

	/**
	 * File content
	 */
	private readonly fileContent: string;

	/**
	 * Constructor
	 */
	constructor( filePath: string, fileContent: string ) {
		this.externalResources = [];
		this.filePath = filePath;
		this.fileName = path.basename( filePath );
		this.fileContent = fileContent;
	}

	/**
	 * Analyze for external resources
	 */
	public getExternalResources(): Array<AngularResource> {

		// Create source file
		let sourceFile: typescript.SourceFile;
		try {
			sourceFile = typescript.createSourceFile( this.fileName, this.fileContent, typescript.ScriptTarget.Latest, true );
		} catch ( error ) {
			throw new Error( error );
		}

		// Run analysis (result will be saved into class properties, necessary due to recursive analysis process)
		this.analyzeNodeForComponentDecorators( sourceFile );

		// Return results
		return this.externalResources;

	}

	/**
	 * Inline external resources into the source file
	 */
	public inlineExternalResources( externalResources: Array<AngularResource> ): string {

		let currentPositionCorrection: number = 0;
		return externalResources.reduce( ( fileContent: string, externalResource: AngularResource ): string => {

			// Replace key
			fileContent = this.replaceAtNode( fileContent, externalResource.newKey, externalResource.node, currentPositionCorrection );
			currentPositionCorrection += externalResource.newKey.length - externalResource.oldKey.length;

			// Replace value(s)
			fileContent = externalResource.urls.reduce( ( fileContent: string, url: AngularResourceUrl ): string => {
				fileContent = this.replaceAtNode( fileContent, `\`${ url.content }\``, url.node, currentPositionCorrection );
				currentPositionCorrection += url.content.length - url.url.length;
				return fileContent;
			}, fileContent );

			return fileContent;

		}, this.fileContent );

	}

	 /**
	  * Analyzer recursively for external resources
	  *
	  * @param currentNode - Current node to analyze
	  */
	private analyzeNodeForComponentDecorators( currentNode: typescript.Node ): void {

		// Check if the current Node is an Angular Component Decorator
		if ( currentNode.kind === typescript.SyntaxKind.Decorator && ( <any> currentNode ).expression.expression.text === 'Component' ) {
			this.analyzeComponentDecoratorNodeForExternalResources( currentNode );
		}

		// Continue analysis recursively for all children
		typescript.forEachChild( currentNode, this.analyzeNodeForComponentDecorators.bind( this ) ); // Bind to keep the 'this' reference

	}

	/**
	 * Analyzer a component decorator for external resources
	 */
	private analyzeComponentDecoratorNodeForExternalResources( currentNode: typescript.Node ): any {

		// Check the decorator parameters
		if ( currentNode.kind === typescript.SyntaxKind.PropertyAssignment ) {

			// Templates
			if ( ( <any> currentNode ).name.text === 'templateUrl' ) {

				// Handle errors
				if (
					( <any> currentNode ).initializer.text === '' ||
					( <any> currentNode ).initializer.text === 'undefined' ||
					( <any> currentNode ).initializer.text === undefined
				) {
					throw new Error( 'Invalid templateUrl.' );
				}

				// Collect as external resource
				this.externalResources.push( {
					oldKey: 'templateUrl',
					newKey: 'template',
					node: ( <any> currentNode ).name,
					urls: [ {
						url: ( <any> currentNode ).initializer.text,
						node: ( <any> currentNode ).initializer
					} ]
				} );

			// Styles
			} else if ( ( <any> currentNode ).name.text === 'styleUrls' ) {

				// Handle errors
				if (
					!( <any> currentNode ).initializer.hasOwnProperty( 'elements' ) ||
					( <any> currentNode ).initializer.elements.length === 0
				) {
					throw new Error( 'Invalid styleUrls.' );
				}

				// Get the actual text
				const styleUrls: Array<AngularResourceUrl> = ( <any> currentNode ).initializer.elements
					.map( ( element: any ): AngularResourceUrl => {
						return {
							url: element.text,
							node: element
						};
					} );

				// Handle errors
				styleUrls.forEach( ( styleUrl: AngularResourceUrl ) => {
					if ( styleUrl.url === '' || styleUrl.url === 'undefined' || styleUrl.url === undefined ) {
						throw new Error( 'Invalid styleUrls.' );
					}
				} );

				// Collect as external resource
				this.externalResources.push( {
					oldKey: 'styleUrls',
					newKey: 'styles',
					node: ( <any> currentNode ).name,
					urls: styleUrls,
				} );

			}

		}

		// Continue analysis recursively for all children
		typescript.forEachChild( currentNode, this.analyzeComponentDecoratorNodeForExternalResources.bind( this ) );

	}

	/**
	 * Replace the text of a node within the file content, optionally with a position correction
	 */
	private replaceAtNode( fileContent: string, replacement: string, node: typescript.Node, positionCorrection: number = 0 ): string {
		return [
			fileContent.substring( 0, node.getStart() + positionCorrection ),
			replacement,
			fileContent.substring( node.getEnd() + positionCorrection, fileContent.length )
		].join( '' );
	}

}
