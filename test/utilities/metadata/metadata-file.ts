import * as fs from 'fs';

/**
 * Metadata File Wrapper
 */
export class MetadataFile {

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
    public getExportName(): string {
        return this.parsedFile.importAs;
    }

    /**
     * Get items with origins
     */
    public getItemsWithOrigins(): { [ type: string ]: string } {
        return this.parsedFile.origins;
    }

    /**
     * Get items
     */
    public getItems(): Array<string> {
        return Object.keys( this.parsedFile.metadata );
    }

    /**
     * Get the inlined template of the given component type
     */
    public getInlinedTemplate( type: string ): string {
        return this.parsedFile.metadata[ type ].decorators[ 0 ].arguments[ 0 ].template;
    }

    /**
     * Tet the inlined styles of the given component type
     */
    public getInlinedStyles( type: string ): Array<string> {
        return this.parsedFile.metadata[ type ].decorators[ 0 ].arguments[ 0 ].styles;
    }

}
