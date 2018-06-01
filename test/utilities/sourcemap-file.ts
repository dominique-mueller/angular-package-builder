import * as fs from 'fs';

/**
 * Sourcemap file
 */
export class SourcemapFile {

	/**
	 * File content
	 */
	private file: any;

	/**
	 * Constructor
	 */
	constructor( path: string ) {
		const fileContent: string = fs.readFileSync( path, 'utf-8' );
        const parsedFileContent: any = JSON.parse( fileContent );
        this.file = parsedFileContent;
	}

	/**
	 * Get the name of the file this sourcemap is for
	 */
	public getFileName(): void {
		return this.file.file;
	}

	/**
	 * Get sources (path -> content)
	 */
	public getSources(): { [ path: string ]: string } {
		return this.file.sources
			.reduce( ( sources: { [ path: string ]: string }, source: string, index: number ): { [ path: string ]: string } => {
				sources[ source ] = this.file.sourcesContent[ index ];
				return sources;
			}, {} );
	}

}
