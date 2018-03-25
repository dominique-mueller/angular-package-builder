import * as proxyquire from 'proxyquire';

import { AngularPackageBuilderInternalConfig } from './internal-config.interface';
import { MemoryFileSystem } from './memory-file-system/memory-file-system';
import { configure } from './tasks/configure';
import { AngularPackageBuilderConfig } from './config.interface';
import { deleteFolder } from './utilities/delete-folder';

/**
 * Angular Package Builder
 */
export class AngularPackageBuilder {

    /**
     * Internal configuration
     */
    private config: AngularPackageBuilderInternalConfig;

    /**
     * Debug flag
     */
    private debug: boolean;

    /**
     * Memory file system
     */
    private memoryFileSystem: MemoryFileSystem;

    /**
     * Do configure
     *
     * @param [configOrConfigUrl='.angular-package.json'] - Configuration, or path to configuration file
     * @param [debug=false]                               - Debug flag
     */
    public async configure( configOrConfigUrl: AngularPackageBuilderConfig | string = '.angular-package.json', debug: boolean = false ):
        Promise<void> {

        // Setup configuration
        this.config = await configure( configOrConfigUrl );
        this.debug = debug;

        // Run initial file setup
        if ( this.debug ) {
			await deleteFolder( this.config.temporary.folder );
		} else {
            this.memoryFileSystem = new MemoryFileSystem();
			await this.memoryFileSystem.fill( this.config.entry.folder );
		}
        await deleteFolder( this.config.output.folder );

    }

    /**
     * Do prepare
     */
    public async prepare(): Promise<void> {
        await this.dynamicImport( './tasks/prepare' ).prepare( this.config );
    }

    /**
     * Do compile
     *
     * @param target - Compilation target
     */
    public async compile( target: 'esm2015' | 'esm5' ): Promise<void> {
        await this.dynamicImport( './tasks/compile' ).compile( this.config, target );
    }

    /**
     * Do bundle
     *
     * @param target - Bundle target
     */
    public async bundle( target: 'fesm2015' | 'fesm5' | 'umd' ): Promise<void> {
        await this.dynamicImport( './tasks/bundle' ).bundle( this.config, target );
    }

    /**
     * Do compose
     */
    public async compose(): Promise<void> {
        await this.dynamicImport( './tasks/compose' ).compose( this.config );

        // Run final file setup
        if ( !this.debug ) {
			await this.memoryFileSystem.persist( this.config.output.folder );
        }

    }

    /**
     * Do import the given module dynamically, with the fs mocked away if debug is disabled
     *
     * @param moduleDefinition - Module definition
     */
    private dynamicImport( moduleDefinition: string ): any {
        return this.debug
            ? require( moduleDefinition )
            : proxyquire( moduleDefinition, {
                fs: this.memoryFileSystem.fs // Mock the file system
            } );
    }

}
