import * as fs from 'fs';

/**
 * Metadata File Wrapper
 */
export class MetadataFile {

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
    public getExportName(): string {
        return this.file.importAs;
    }

    /**
     * Get items with origins
     */
    public getItemsWithOrigins(): { [ type: string ]: string } {
        return this.file.origins;
    }

    /**
     * Get items
     */
    public getItems(): Array<string> {
        return Object.keys( this.file.metadata );
    }

    /**
     * Get the inlined template of the given component type
     */
    public getInlinedComponentTemplate( type: string ): string {
        return this.file.metadata[ type ].decorators[ 0 ].arguments[ 0 ].template;
    }

    /**
     * Tet the inlined styles of the given component type
     */
    public getInlinedComponentStyles( type: string ): Array<string> {
        return this.file.metadata[ type ].decorators[ 0 ].arguments[ 0 ].styles;
    }

}
