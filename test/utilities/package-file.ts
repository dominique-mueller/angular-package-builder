import * as fs from 'fs';

/**
 * Package File Wrapper
 */
export class PackageFile {

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
     * Get the export name
     */
    public getPackageName(): string {
        return this.file.name;
    }

	/**
	 * Get package entries
	 */
	public getEntries(): { [ entry: string ]: string } {
		return {
			module: this.file.module,
			es2015: this.file.es2015,
			esm5: this.file.esm5,
			esm2015: this.file.esm2015,
			fesm5: this.file.fesm5,
			fesm2015: this.file.fesm2015,
			main: this.file.main,
			typings: this.file.typings
		};
	}

}
