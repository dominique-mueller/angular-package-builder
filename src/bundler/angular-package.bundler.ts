import { posix as path } from 'path';

import { AngularPackage } from '../angular-package';
import { RollupConfigurationBuilder } from './rollup-configuration-builder';
import { OutputChunk, rollup, InputOptions, OutputOptions } from 'rollup';

/**
 * Angular Package Bundler
 */
export class AngularPackageBundler {

    /**
     * Angular Package
     */
    private readonly angularPackage: AngularPackage;

    /**
     * Constructor
     *
     * @param angularPackage Angular Package
     */
    constructor( angularPackage: AngularPackage ) {
        this.angularPackage = angularPackage;
    }

    /**
     * Create bundle
     *
     * @param   target Bundle target
     * @returns        Promise, resolves when done
     */
    public async bundle( target: 'fesm2015' | 'fesm5' | 'umd' ): Promise<void> {

        // Get configuration
        const { inputOptions, outputOptions }: {
            inputOptions: InputOptions,
            outputOptions: OutputOptions
        } = this.buildRollupConfiguration( target );

        // Create and write bundle
        const bundle: OutputChunk = <OutputChunk> await rollup( inputOptions );
        await bundle.write( outputOptions );

    }

    /**
     * Build rollup configuration
     *
     * @param   target Bundle target
     * @returns        Rollup input & output configuration
     */
    private buildRollupConfiguration( target: 'fesm2015' | 'fesm5' | 'umd' ): {
        inputOptions: InputOptions,
        outputOptions: OutputOptions
    } {

        // Collect information
        const entryFileName: string = `${ this.angularPackage.packageName.split( '/' ).pop() }.js`;
        const entryFile: string = target === 'fesm2015'
            ? path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'esm2015', entryFileName )
            : path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'esm5', entryFileName );
        const outDir: string = target === 'umd'
            ? path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'bundles' )
            : path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', target );

        // Build Rollup configuration
        return new RollupConfigurationBuilder()
            .withName( this.angularPackage.packageName )
            .excludeDependencies( this.angularPackage.dependencies )
            .fromEntryFile( entryFile )
            .toTarget( target )
            .toOutDir( outDir )
            .build();

    }

}
