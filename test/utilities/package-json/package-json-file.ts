import * as fs from 'fs';

/**
 * Package JSON File Wrapper
 */
export class PackageJsonFile {

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
     * Get the export name
     */
    public getPackageName(): string {
        return this.parsedFile.name;
    }

	/**
	 * Get package entries
	 */
	public getEntries(): { [ entry: string ]: string } {
		return {
			module: this.parsedFile.module,
			es2015: this.parsedFile.es2015,
			esm5: this.parsedFile.esm5,
			esm2015: this.parsedFile.esm2015,
			fesm5: this.parsedFile.fesm5,
			fesm2015: this.parsedFile.fesm2015,
			main: this.parsedFile.main,
			typings: this.parsedFile.typings
		};
	}

}
