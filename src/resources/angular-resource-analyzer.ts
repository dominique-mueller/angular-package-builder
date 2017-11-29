import * as fs from 'fs';
import { posix as path } from 'path';

import * as typescript from 'typescript';

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
	 * Source file
	 */
	private readonly sourceFile: typescript.SourceFile;

	/**
	 * Constuctor
	 *
	 * @param filePath    - File path
	 * @param fileContent - File content
	 */
	constructor( filePath: string, fileContent: string ) {

		this.externalResources = [];
		this.filePath = filePath;
		this.fileName = path.basename( filePath );
		this.fileContent = fileContent;

		// Create source file
		try {
			this.sourceFile = typescript.createSourceFile( this.fileName, this.fileContent, typescript.ScriptTarget.Latest, true );
		} catch ( error ) {
			throw new Error( [
				`An error occured while trying to parse the file "${this.fileName}" as a TypeScript source file.`,
				error.message
			].join( '\n' ) );
		}

	}

	/**
	 * Analyze file for external resources
	 *
	 * @returns - List of external resources (content not loaded)
	 */
	public findExternalResources(): Array<AngularResource> {
		this.findComponentDecorators( this.sourceFile );
		return this.externalResources;
	}

	/**
	 * Inline external resources into the source file
	 * Inspired by <https://github.com/Microsoft/TypeScript/issues/7580#issuecomment-198552002>
	 *
	 * @param   externalResources - List of external resources, with the content loaded
	 * @returns                   - File with resources inlined
	 */
	public inlineExternalResources( externalResources: Array<AngularResource> ): string {

		// Replace all external resources with inlined ones (changing both key and value of resource declarations)
		return externalResources
			.reverse() // Keep node start & end correct
			.reduce( ( fileContent: string, externalResource: AngularResource ): string => {

				// Replace value(s) -- before key
				fileContent = externalResource.urls
					.reverse() // Keep node start & end correct
					.reduce( ( fileContent: string, url: AngularResourceUrl ): string => {
						return this.replaceNodeContent( fileContent, `\`${url.content}\``, url.node );
					}, fileContent );

				// Replace key -- after values
				fileContent = this.replaceNodeContent( fileContent, externalResource.newKey, externalResource.node );

				return fileContent;

			}, this.fileContent );

	}

	/**
	 * Find component decorators, recursively
	 *
	 * @param node - Node
	 */
	private findComponentDecorators( node: typescript.Node ): void {
		if ( this.isComponentDecorator( node ) ) {
			this.findExternalTemplatesAndStyles( node );
		}
		typescript.forEachChild( node, this.findComponentDecorators.bind( this ) ); // Bind to keep the 'this' reference
	}

	/**
	 * Find external templates and styles (within a component decorator)
	 *
	 * @param node - Node
	 */
	private findExternalTemplatesAndStyles( node: typescript.Node ): void {

		// Templates
		if ( this.isTemplateUrlDeclaration( node ) ) {

			// Collect information
			const templateUrlKeyNode: any = ( <any> node ).name;
			const templateUrlValueNode: any = ( <any> node ).initializer;
			const templateUrlValue: string | undefined = templateUrlValueNode.text;

			// Handle errors
			if ( templateUrlValue === '' || templateUrlValue === 'undefined' || templateUrlValue === undefined ) {
				this.throwError( node, `The component in "${this.fileName}" has an empty template URL.` );
			}
			if ( !templateUrlValue.endsWith( '.html' ) ) {
				this.throwError( node, [
					`The component in "${this.fileName}" has a template URL with a missing / unsupported file format.`,
					'Make sure the template URL points to a ".html" file.'
				].join( '\n' ) );
			}

			// Collect as external resource
			this.externalResources.push( {
				oldKey: 'templateUrl',
				newKey: 'template',
				node: templateUrlKeyNode,
				urls: [ {
					url: templateUrlValue,
					node: templateUrlValueNode
				}]
			} );

		}

		// Styles
		if ( this.isStyleUrlsDeclaration( node ) ) {

			// Collect information
			const styleUrlsKeyNode: any = ( <any> node ).name;
			const styleUrlsValueNode: any = ( <any> node ).initializer;
			const styleUrlsElementNodes: Array<any> | undefined = styleUrlsValueNode.elements;

			// Handle errors
			if ( !styleUrlsElementNodes || styleUrlsElementNodes.length === 0 ) {
				this.throwError( node, `The component in "${this.fileName}" has an empty list of style URLs.` );
			}

			// Get the actual text
			const styleUrls: Array<AngularResourceUrl> = styleUrlsElementNodes
				.map( ( element: any ): AngularResourceUrl => {
					return {
						url: element.text,
						node: element
					};
				} );

			// Handle errors
			styleUrls.forEach( ( styleUrl: AngularResourceUrl ) => {
				if ( styleUrl.url === '' || styleUrl.url === 'undefined' || styleUrl.url === undefined ) {
					this.throwError( styleUrl.node, `The component in "${this.fileName}" has an empty style URL.` );
				}
				if ( !( styleUrl.url.endsWith( '.css' ) || styleUrl.url.endsWith( '.sass' ) || styleUrl.url.endsWith( '.scss' ) ) ) {
					this.throwError( styleUrl.node, [
						`The component in "${this.fileName}" has a style URL with a missing / unsupported file format.`,
						'Make sure the style URL points to a ".css", ".scss" or ".sass" file.'
					].join( '\n' ) );
				}
			} );

			// Collect as external resource
			this.externalResources.push( {
				oldKey: 'styleUrls',
				newKey: 'styles',
				node: styleUrlsKeyNode,
				urls: styleUrls,
			} );

		}

		// Continue analysis recursively for all children
		typescript.forEachChild( node, this.findExternalTemplatesAndStyles.bind( this ) );

	}

	/**
	 * Check if the given node is a component decotator
	 *
	 * @param   node - Node
	 * @returns      - Flag, describing whether the given node is a component decorator
	 */
	private isComponentDecorator( node: typescript.Node ): boolean {
		return typescript.isDecorator( node ) &&
			node.getChildren().find( typescript.isCallExpression ).getChildren().find( typescript.isIdentifier ).getText() === 'Component';
	}

	/**
	 * Check if the given node is a template URL declaration
	 *
	 * @param   node - Node
	 * @returns      - Flag, describing whether the given node is a template URL declaration
	 */
	private isTemplateUrlDeclaration( node: typescript.Node ): boolean {
		return typescript.isPropertyAssignment( node ) &&
			node.name.getText() === 'templateUrl';
	}

	/**
	 * Check if the given node is a style URLs declaration
	 *
	 * @param   node - Node
	 * @returns      - Flag, describing whether the given node is a style URLs declaration
	 */
	private isStyleUrlsDeclaration( node: typescript.Node ): boolean {
		return typescript.isPropertyAssignment( node ) &&
			node.name.getText() === 'styleUrls';
	}

	/**
	 * Replace the text of a node within the file content
	 *
	 * @param   fileContent - File content
	 * @param   replacement - Text to place in
	 * @param   node        - Node
	 * @returns             - New file content
	 */
	private replaceNodeContent( fileContent: string, replacement: string, node: typescript.Node ): string {
		return `${ fileContent.substring( 0, node.getStart() ) }${ replacement }${ fileContent.substring( node.getEnd() ) }`;
	}

	/**
	 * Throw error with error details
	 *
	 * @param node    - Node
	 * @param message - Message
	 */
	private throwError( node: typescript.Node, message: string ): void {
		const { character, line }: typescript.LineAndCharacter = this.sourceFile.getLineAndCharacterOfPosition( node.getStart() );
		throw new Error( [
			message,
			`Details: ${this.filePath} at ${line + 1}:${character + 1}: "${node.getText()}"`
		].join( '\n' ) );
	}

}

/**
 * Angular resource URL interface
 */
export interface AngularResourceUrl {
	url: string;
	node: typescript.Node;
	content?: string; // Not part of the initial analysis result, added later on
}

/**
 * Angular Resource Interface
 */
export interface AngularResource {
	oldKey: string;
	newKey: string;
	node: typescript.Node;
	urls: Array<AngularResourceUrl>;
}
