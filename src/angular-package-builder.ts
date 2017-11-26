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
     * Do compile
     *
     * @param target - Compilation target
     */
    public async compile( target: 'ES2015' | 'ES5' ): Promise<void> {
        return ( await this.import( './tasks/compile-typescript' ) ).compileTypescript( this.config, target );
    }

    private import( moduleDefinition: string ): Promise<any> {
        return this.debug
            ? import( moduleDefinition )
            : proxyquire( moduleDefinition, {
                fs: MemoryFileSystem.fs // Mock the file system
            } );
    }

}
