import * as fs from 'fs';
import * as path from 'path';

import * as typescript from 'typescript';

/**
 * Angular Resource Analyzer
 */
export class AngularResourceAnalyzer {

	/**
	 * List of found external resources
	 */
	private externalResources: Array<any>;

	/**
	 * Relative path of the file to be tested
	 */
	private readonly filePath: string;

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
		this.fileContent = fileContent;
	}

	/**
	 * Analyze for external resources
	 */
	public analyze(): Array<any> {

		// Create source file
		let sourceFile: typescript.SourceFile;
		try {
			sourceFile = typescript.createSourceFile(
				path.basename( this.filePath ),
				this.fileContent,
				typescript.ScriptTarget.Latest,
				true
			);
		} catch ( error ) {
			throw new Error( error );
		}

		// Run analysis
		this.analyzeNodeForComponentDecorators( sourceFile );

		return this.externalResources;

	}

	/**
	 * Analyzer recursively for external resources
	 */
	private analyzeNodeForComponentDecorators( currentNode: typescript.Node ): void {

		// Analyze function / identifier names only
		if ( currentNode.kind === typescript.SyntaxKind.Decorator && ( <any> currentNode ).expression.expression.text === 'Component' ) {
			this.analyzeComponentDecoratorNodeForExternalResources( currentNode );
		}

		typescript.forEachChild( currentNode, this.analyzeNodeForComponentDecorators.bind( this ) ); // Recursion, keeping 'this' reference

	}

	/**
	 * Analyzer a component decorator for external resources
	 */
	private analyzeComponentDecoratorNodeForExternalResources( currentNode: typescript.Node ): any {

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
				const styleUrls: Array<string> = ( <any> currentNode ).initializer.elements
					.map( ( element: any ): any => {
						return {
							url: element.text,
							node: element
						};
					} );

				// Handle errors
				styleUrls.forEach( ( styleUrl: any ) => {
					if ( styleUrl === '' || styleUrl === 'undefined' || styleUrl === undefined ) {
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

		typescript.forEachChild( currentNode, this.analyzeComponentDecoratorNodeForExternalResources.bind( this ) );

	}

}
