import * as fs from 'fs';

/**
 * Sourcemap file
 */
export class SourcemapFile {

	/**
	 * File content (unparsed)
	 */
	private readonly file: string;

	/**
	 * File content (parsed)
	 */
	private readonly parsedFile: any;

	/**
	 * Constructor
	 */
	constructor( path: string ) {
		this.file = fs.readFileSync( path, 'utf-8' );
        this.parsedFile = JSON.parse( this.file );
	}

	/**
	 * Check if the file is empty
	 */
	public isEmpty(): boolean {
		return this.file.length === 0;
	}

	/**
	 * Get the name of the file this sourcemap is for
	 */
	public getFileName(): void {
		return this.parsedFile.file;
	}

	/**
	 * Get sources (path -> content)
	 */
	public getSources(): { [ path: string ]: string } {
		return this.parsedFile.sources
			.reduce( ( sources: { [ path: string ]: string }, source: string, index: number ): { [ path: string ]: string } => {
				sources[ source ] = this.parsedFile.sourcesContent[ index ];
				return sources;
			}, {} );
	}

}
