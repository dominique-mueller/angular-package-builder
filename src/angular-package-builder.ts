import { AngularPackageBuilderInternalConfig } from './internal-config.interface';

import * as proxyquire from 'proxyquire';

import MemoryFileSystem from './memory-file-system/memory-file-system';

export class AngularPackageBuilder {

    private readonly config: AngularPackageBuilderInternalConfig;

    private readonly debug: boolean;

    constructor( config: AngularPackageBuilderInternalConfig, debug: boolean = false ) {
        this.config = config;
        this.debug = debug;
    }

    /**
     * Do prepare
     */
    public async prepare(): Promise<void> {
        return ( await this.dynamicImport( './tasks/prepare' ) ).prepare( this.config );
    }

    /**
     * Do compile
     *
     * @param target - Compilation target
     */
    public async compile( target: 'ES2015' | 'ES5' ): Promise<void> {
        return ( await this.dynamicImport( './tasks/compile' ) ).compile( this.config, target );
    }

    /**
     * Do bundle
     *
     * @param target - Bundle target
     */
    public async bundle( target: 'ES2015' | 'ES5' | 'UMD' ): Promise<void> {
        return ( await this.dynamicImport( './tasks/bundle' ) ).bundle( this.config, target );
    }

    /**
     * Do compose
     */
    public async compose(): Promise<void> {
        return ( await this.dynamicImport( './tasks/compose' ) ).compose( this.config );
    }

    private dynamicImport( moduleDefinition: string ): Promise<any> {
        // return this.debug
        //     ? import( moduleDefinition )
        //     : proxyquire( moduleDefinition, {
        //         fs: MemoryFileSystem.fs // Mock the file system
        //     } );

        return proxyquire( moduleDefinition, {
            fs: MemoryFileSystem.fs // Mock the file system
        } );
    }

}
