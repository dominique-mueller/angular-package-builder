import { posix as path } from 'path';

import { InputOptions, OutputOptions, RollupWarning } from 'rollup';
import * as rollupCommonjsPlugin from 'rollup-plugin-commonjs';
import * as rollupNodeResolvePlugin from 'rollup-plugin-node-resolve';

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
	 * Rollup bundling targets
	 */
	private static readonly compilationTargets: { [ target: string ]: string } = {
        fesm2015: 'es',
        fesm5: 'es',
        umd: 'umd'
	};

    /**
     * Constructor
     */
    constructor() {
        this.inputOptions = <InputOptions> this.getBaseInputOptions();
        this.outputOptions = <OutputOptions> this.getBaseOutputOptions();
    }

    /**
     * Add entry file
     *
     * @param   entryFile Entry file
     * @returns          This instance of the Rollup configuration builder
     */
    public withEntryFile( entryFile: string ): RollupConfigurationBuilder {
        this.inputOptions.input = entryFile;
        return this;
    }

    /**
     * Add dependencies
     *
     * @param   dependencies Dependencies
     * @returns              This instance of the Rollup configuration builder
     */
    public withDependencies( dependencies: any ): RollupConfigurationBuilder {
        this.inputOptions.external = Object.keys( dependencies );
        this.outputOptions.globals = dependencies;
        return this;
    }

    /**
     * Add package name
     *
     * @param   packageName Package name
     * @returns             This instance of the Rollup configuration builder
     */
    public withName( packageName: string ): RollupConfigurationBuilder {
        this.outputOptions.name = packageName.split( '/' ).pop(); // Required for UMD bundles
        return this;
    }

    /**
     * Add bundling target
     *
     * @param   packageName Package name
     * @returns             This instance of the Rollup configuration builder
     */
    public toTarget( target: 'fesm2015' | 'fesm5' | 'umd' ): RollupConfigurationBuilder {
        this.outputOptions.format = <any> RollupConfigurationBuilder.compilationTargets[ target ];
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
        return {
            inputOptions: this.inputOptions,
            outputOptions: this.outputOptions
        };
    }

    /**
     * Get base input options
     *
     * @returns Base input options
     */
    private getBaseInputOptions(): Partial<InputOptions> {
        return {
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

                // Print prettier warning log
                // const betterWarningMessage: string = warning.message
                // 	.replace( /\\/g, '/' )
                // 	.replace( sourcePath.split( path.sep ).slice( -2 ).join( path.sep ), config.entry.folder.split( path.sep ).pop() );
                // Logger.warn( `${ warning.code } – ${ betterWarningMessage } (${ target } target)` );

            },
            preserveSymlinks: true, // No idea why this is required, though ...
            plugins: [
                rollupNodeResolvePlugin(),
                rollupCommonjsPlugin()
            ]
        };
    }

    /**
     * Get base output options
     *
     * @returns Base output options
     */
    private getBaseOutputOptions(): Partial<OutputOptions> {
        return {
            sourcemap: true
        };
    }

}
