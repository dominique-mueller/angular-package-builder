import { posix as path } from 'path';

import { OutputOptions, RollupWarning, RollupFileOptions, SourceDescription } from 'rollup';
import * as rollupCommonjsPlugin from 'rollup-plugin-commonjs';
import * as rollupNodeResolvePlugin from 'rollup-plugin-node-resolve';

import { getFileNameByPackageName } from '../utilities/get-file-name-by-package-name';
import { rollupBundlingTargets } from './rollup-bundling-targets';
import { AngularPackageLogger } from '../logger/angular-package-logger';

/**
 * Rollup Configuration Builder
 */
export class RollupConfigurationBuilder {

    /**
     * Rollup input options
     */
    private readonly inputOptions: RollupFileOptions;

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
        this.inputOptions = <RollupFileOptions>{
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
                rollupCommonjsPlugin(),
                ( () => {
                    let processedFiles: number = 0;
                    return {
                        name: 'logger',
                        load: ( id: string ) => {
                            processedFiles++;
                            const normalizedFilePath: string = id.toString().replace( /\\/g, path.sep );
                            const relativeFilePath: string = normalizedFilePath.indexOf( 'node_modules' ) === -1
                                ? path.relative( path.dirname( this.inputOptions.input ), normalizedFilePath )
                                : `node_modules${ normalizedFilePath.split( 'node_modules' ).slice( -1 )[ 0 ] }`;
                            AngularPackageLogger.log( {
                                message: `Process files (${ processedFiles }) :: ${ relativeFilePath }`
                            } );
                        },
                        ongenerate: ( options: OutputOptions, source: SourceDescription ) => {
                            AngularPackageLogger.log( {
                                message: `Generate bundle :: ${ path.basename( options.file ) }`
                            } );
                        },
                        onwrite: ( options: OutputOptions, source: SourceDescription ) => {
                            AngularPackageLogger.log( {
                                message: `Write bundle :: ${ path.basename( options.file ) }`
                            } );
                        },
                    };
                } )()
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
     * @param   knownDependencies    Known dependencies, possibly with UMD IDs
     * @param   expectedDependencies Expected dependencies with UMD IDs
     * @returns                      This instance of the Rollup configuration builder
     */
    public setDependencies( knownDependencies: { [ dependency: string ]: string }, expectedDependencies: { [ dependency: string ]: string } ): RollupConfigurationBuilder {

        // Handle externals discovery
        const knownDependencyModules: Array<string> = Object.keys( knownDependencies );
        this.inputOptions.external = ( moduleName: string ): boolean => {
            return this.isExternalModule( moduleName, knownDependencyModules );
        };

        // Handle globals
        this.outputOptions.globals = ( moduleName: string ): string => {
            return this.getModuleGlobalName( moduleName, knownDependencies, expectedDependencies );
        };

        return this;
    }

    /**
     * Build
     *
     * @returns Rollup input & output configuration
     */
    public build(): {
        inputOptions: RollupFileOptions,
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

    /**
     * Check if the given module is an external module, taking deep imports into account as well
     *
     * @param   moduleName        Module name
     * @param   knownDependencies List of known dependencies
     * @returns                   Flag, describing whether the given module name is an external module
     */
    private isExternalModule( moduleName: string, knownDependencies: Array<string> ): boolean {
        return knownDependencies
            .some( ( knownDependency: string ): boolean => {
                return moduleName === knownDependency || moduleName.startsWith( `${ knownDependency }/` );
            } );
    }

    /**
     * Get global name for the given module, based on known & expected dependencies
     *
     * @param   moduleName           Module name
     * @param   knownDependencies    Known dependencies with potential global names
     * @param   expectedDependencies Expected dependencies with global names
     * @returns                      Global Name (UMD ID)
     */
    private getModuleGlobalName( moduleName: string, knownDependencies: { [ dependency: string ]: string }, expectedDependencies: { [ dependency: string ]: string } ): string {

        // Prefer known dependencies
        if ( !!knownDependencies[ moduleName ] ) {
            return knownDependencies[ moduleName ];

            // If necessary, use the expected dependencies as a fallback
        } else if ( !!expectedDependencies[ moduleName ] ) {
            return expectedDependencies[ moduleName ];

            // If nothing matches, let rollup figure it out
        } else {
            return '';
        }

    }

}
