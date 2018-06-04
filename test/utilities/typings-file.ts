import * as fs from 'fs';

/**
 * Typings File Wrapper
 */
export class TypingsFile {

    /**
     * File content (unparsed)
     */
    private readonly file: string;

    /**
     * Constructor
     */
    constructor( path: string ) {
        this.file = fs.readFileSync( path, 'utf-8' );
    }

    /**
     * Check if the file is empty
     */
    public isEmpty(): boolean {
        return this.file.length === 0;
    }

    /**
     * Check if the file includes a class with the given name
     */
    public hasClass( className: string ): boolean {
        return this.file.indexOf( `export declare class ${ className } {` ) !== -1;
    }

}
