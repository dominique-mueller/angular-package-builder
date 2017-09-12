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
	 * Analyze for focused / ignored tests
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
		this.analyzeNodeAndChildrenForExternalResources( sourceFile );

		return this.externalResources;

	}

	private analyzeNodeAndChildrenForExternalResources( currentNode: typescript.Node ): void {

		// Analyze function / identifier names only
		if ( currentNode.kind === typescript.SyntaxKind.Decorator && ( <any> currentNode ).expression.expression.text === 'Component' ) {
			this.analyzeComponentDecoratorForExternalResources( currentNode );
		}

		typescript.forEachChild( currentNode, this.analyzeNodeAndChildrenForExternalResources.bind( this ) ); // Recursion, keeping 'this' reference

	}

	private analyzeComponentDecoratorForExternalResources( currentNode: typescript.Node ): any {

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
					type: 'template',
					key: {
						start: ( <any> currentNode ).name.getStart(),
						end: ( <any> currentNode ).name.getEnd()
					},
					urls: [ {
						url: ( <any> currentNode ).initializer.text,
						start: ( <any> currentNode ).initializer.getStart(),
						end: ( <any> currentNode ).initializer.getEnd()
					} ]
					// node: currentNode,
					// start: currentNode.getStart(),
					// end: currentNode.getEnd()
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
					.map( ( element: any ): string => {
						return element.text;
					} );

				// Handle errors
				styleUrls.forEach( ( styleUrl: any ) => {
					if ( styleUrl === '' || styleUrl === 'undefined' || styleUrl === undefined ) {
						throw new Error( 'Invalid styleUrls.' );
					}
				} );

				// Collect as external resource
				this.externalResources.push( {
					type: 'styles',
					urls: styleUrls,
					// node: currentNode,
					start: currentNode.getStart(),
					end: currentNode.getEnd()
				} );

			}

		}

		typescript.forEachChild( currentNode, this.analyzeComponentDecoratorForExternalResources.bind( this ) );

	}

}
