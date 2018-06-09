import * as fs from 'fs';

/**
 * JavaScript ES2015 File Wrapper
 */
export class JavascriptES2015File {

    /**
     * File content (unparsed)
     */
    private readonly file: string;

    /**
     * Language level keywords
     */
    private static readonly es2015Keywords: Array<string> = [
        'class'
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
    public isES2015LanguageLevel(): boolean {
        return JavascriptES2015File.es2015Keywords.every( ( keyword: string ): boolean => {
            return this.file.indexOf( keyword ) !== -1;
        } );
    }

    /**
     * Check if the file has the correct module format
     */
    public isESModule(): boolean {
        return JavascriptES2015File.esKeywords.every( ( keyword: string ): boolean => {
            return this.file.indexOf( keyword ) !== -1;
        } );
    }

    /**
     * Check if the file includes a class with the given name
     */
    public hasClass( className: string ): boolean {
        return this.file.indexOf( `class ${ className }` ) !== -1;
    }

}
