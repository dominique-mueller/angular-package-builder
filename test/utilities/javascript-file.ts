import * as fs from 'fs';

/**
 * JavaScript File Wrapper
 */
export class JavascriptFile {

    /**
     * File content
     */
    private file: string;

    /**
     * Constructor
     */
    constructor( path: string ) {
        this.file = fs.readFileSync( path, 'utf-8' );
    }

}
