import { posix as path } from 'path';

import { InputOptions, OutputOptions, RollupWarning } from 'rollup';
import * as rollupCommonjsPlugin from 'rollup-plugin-commonjs';
import * as rollupNodeResolvePlugin from 'rollup-plugin-node-resolve';

import { getFileNameByPackageName } from '../utilities/get-file-name-by-package-name';
import { rollupBundlingTargets } from './rollup-bundling-targets';

/**
 * Rollup Configuration Builder
 */
export class RollupConfigurationBuilder {

    /**
     * Rollup input options
     */
    private readonly inputOptions: InputOptions;

    /**
     * Rollup output options
     */
    private readonly outputOptions: OutputOptions;

    /**
     * Output directory
     */
    private outDir: string;

    /**
     * Constructor
     */
    constructor() {
        this.inputOptions = <InputOptions> {
            onwarn: ( warning: RollupWarning ): void => {

                // Supress THIS_IS_UNDEFINED warnings, as they're not having an effect on the bundle
                // - Documentation: https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
                // - Recommendation: https://github.com/rollup/rollup/issues/794#issuecomment-260694288
                if ( warning.code === 'THIS_IS_UNDEFINED' ) {
                    return;
                }

                // Supress UNUSED_EXTERNAL_IMPORT warnings, as they're optimzation warnings
                if ( warning.code === 'UNUSED_EXTERNAL_IMPORT' ) {
                    return;
                }

            },
            preserveSymlinks: true, // No idea why this is required, though ...
            plugins: [
                rollupNodeResolvePlugin(),
                rollupCommonjsPlugin()
            ]
        };
        this.outputOptions = {
            sourcemap: true
        };
        this.outDir = '';
    }

    /**
     * Set package name
     *
     * @param   packageName Package name
     * @returns             This instance of the Rollup configuration builder
     */
    public setPackageName( packageName: string ): RollupConfigurationBuilder {
        this.outputOptions.name = getFileNameByPackageName( packageName );
        return this;
    }

    /**
     * Set entry file
     *
     * @param   entryFile Entry file
     * @returns           This instance of the Rollup configuration builder
     */
    public setEntry( entryFile: string ): RollupConfigurationBuilder {
        this.inputOptions.input = entryFile;
        return this;
    }

    /**
     * Set bundling target
     *
     * @param   target Bundling target
     * @returns        This instance of the Rollup configuration builder
     */
    public setTarget( target: 'fesm2015' | 'fesm5' | 'umd' ): RollupConfigurationBuilder {
        this.outputOptions.format = rollupBundlingTargets[ target ];
        return this;
    }

    /**
     * Set bundling output directory
     *
     * @param   outDir Output directory
     * @returns        This instance of the Rollup configuration builder
     */
    public setOutDir( outDir: string ): RollupConfigurationBuilder {
        this.outDir = outDir;
        return this;
    }

    /**
     * Set external dependencies
     *
     * @param   dependencies Dependencies
     * @returns              This instance of the Rollup configuration builder
     */
    public setDependencies( dependencies: any ): RollupConfigurationBuilder {
        this.inputOptions.external = Object.keys( dependencies );
        this.outputOptions.globals = dependencies;
        return this;
    }

    /**
     * Build
     *
     * @returns Rollup input & output configuration
     */
    public build(): {
        inputOptions: InputOptions,
        outputOptions: OutputOptions
    } {
        this.outputOptions.file = this.deriveOutFilePath();
        return {
            inputOptions: this.inputOptions,
            outputOptions: this.outputOptions
        };
    }

    /**
     * Derive output file name, based on collected information
     *
     * @returns Output file name
     */
    private deriveOutFilePath(): string {
        const bundleSuffix: string = this.outputOptions.format === 'umd'
            ? '.umd'
            : '';
        const fileName: string = `${ this.outputOptions.name }${ bundleSuffix }.js`;
        return path.join( this.outDir, fileName );
    }

}
