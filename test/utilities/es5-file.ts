import * as fs from 'fs';

/**
 * JavaScript ES5 File Wrapper
 */
export class JavascriptES5File {

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
    private static readonly esKeywords: Array<string> = [
        'import',
        'export'
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
        return JavascriptES5File.es5Keywords.every( ( keyword: string ): boolean => {
            return this.file.indexOf( keyword ) !== -1;
        } );
    }

    /**
     * Check if the file has the correct module format
     */
    public isESModule(): boolean {
        return JavascriptES5File.esKeywords.every( ( keyword: string ): boolean => {
            return this.file.indexOf( keyword ) !== -1;
        } );
    }

    /**
     * Check if the file includes a class with the given name
     */
    public hasClass( className: string ): boolean {
        return this.file.indexOf( `var ${ className } =` ) !== -1 &&
            this.file.indexOf( `function ${ className }() {` ) !== -1;
    }

}
