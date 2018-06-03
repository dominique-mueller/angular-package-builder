import * as fs from 'fs';

/**
 * JavaScript UMD File Wrapper
 */
export class JavascriptUMDFile {

    /**
     * File content (unparsed)
     */
    private readonly file: string;

    /**
     * Language level keywords
     */
    private static readonly es5Keywords: Array<string> = [
        'var',
        'function'
    ];

    /**
     * Module format keywords
     */
    private static readonly umdKeywords: Array<string> = [
        '\'use strict\';',
        'require',
        'exports',
        'module',
        'amd'
    ];

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
     * Check if the file has the correct language level
     */
    public isES5LanguageLevel(): boolean {
        return JavascriptUMDFile.es5Keywords.every( ( keyword: string ): boolean => {
            return this.file.indexOf( keyword ) !== -1;
        } );
    }

    /**
     * Check if the file has the correct module format
     */
    public isUMDModule(): boolean {
        return JavascriptUMDFile.umdKeywords.every( ( keyword: string ): boolean => {
            return this.file.indexOf( keyword ) !== -1;
        } );
    }

    /**
     * Check if the file includes a class with the given name
     */
    public hasClass( className: string ): boolean {
        return this.file.indexOf( `var ${ className } =` ) !== -1 &&
            this.file.indexOf( `function ${ className }() {` ) !== -1 &&
            this.file.indexOf( `exports.${ className } = ${ className };` ) !== -1;
    }

}
