/**
 * Metadata File Wrapper
 */
export class MetadataFile {

    /**
     * Metadata file
     */
    private metadataFile: any;

    /**
     * Read metadata file from source
     */
    public fromSource( path: string ): void {
        // TODO: Read and parse as JSON
    }

    /**
     * Get the export name
     */
    public getExportName(): string {
        return this.metadataFile.importAs;
    }

    /**
     * Get items with origins
     */
    public getItemsWithOrigins(): { [ type: string ]: string } {
        return this.metadataFile.origins;
    }

    /**
     * Get items
     */
    public getItems(): Array<string> {
        return Object.keys( this.metadataFile.metadata );
    }

    /**
     * Get the inlined template of the given component type
     */
    public getInlinedComponentTemplate( type: string ): string {
        return this.metadataFile.metadata[ type ].decorators[ 0 ].arguments[ 0 ].template;
    }

    /**
     * Tet the inlined styles of the given component type
     */
    public getInlinedComponentStyles( type: string ): Array<string> {
        return this.metadataFile.metadata[ type ].decorators[ 0 ].arguments[ 0 ].styles;
    }

}
