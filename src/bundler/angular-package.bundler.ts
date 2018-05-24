import * as path from 'path';

import { gte } from 'semver';
import { rollup, OutputOptions, RollupFileOptions, Bundle } from 'rollup';

import { AngularPackage } from '../angular-package';
import { RollupConfigurationBuilder } from './rollup-configuration-builder';
import { getInstalledDependencyVersion } from '../utilities/get-installed-dependency-version';
import { angularDependencies } from './dependencies/angular-dependencies';
import { rxjs6Dependencies } from './dependencies/rxjs6-dependencies';
import { rxjs5Dependencies } from './dependencies/rxjs5-dependencies';
import { typescriptDependencies } from './dependencies/typescript-dependencies';

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
            inputOptions: RollupFileOptions,
            outputOptions: OutputOptions
        } = await this.buildRollupConfiguration( target );

        // Create and write bundle
        const bundle: Bundle = await rollup( inputOptions );
        await bundle.write( outputOptions );

    }

    /**
     * Build rollup configuration
     *
     * @param   target Bundle target
     * @returns        Rollup input & output configuration
     */
    private async buildRollupConfiguration( target: 'fesm2015' | 'fesm5' | 'umd' ): Promise<{
        inputOptions: RollupFileOptions,
        outputOptions: OutputOptions
    }> {

        // Collect information
        const entryFileName: string = `${ this.angularPackage.packageName.split( '/' ).pop() }.js`;
        const entryFile: string = target === 'fesm2015'
            ? path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'esm2015', entryFileName )
            : path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'esm5', entryFileName );
        const outDir: string = target === 'umd'
            ? path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'bundles' )
            : path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', target );

        // Collect dependency information
        const expectedDependencies: { [ dependency: string ]: string } = await this.getExpectedDependencies();

        // Build Rollup configuration
        return new RollupConfigurationBuilder()
            .setPackageName( this.angularPackage.packageName )
            .setEntry( entryFile )
            .setTarget( target )
            .setOutDir( outDir )
            .setDependencies( this.angularPackage.dependencies, expectedDependencies )
            .build();

    }

    /**
     * Get expected dependencies, partially based on the installed version
     *
     * @returns Angular Compiller CLI arguments
     */
    private async getExpectedDependencies(): Promise<{ [ dependency: string ]: string }> {

        // Get the installed RxJS version
        const rxjsVersion: string = await getInstalledDependencyVersion( 'rxjs' );

        // Get the expected RxJS dependencies
        const rxjsDependencies: { [ dependency: string ]: string } = gte( rxjsVersion, '6.0.0' )
            ? rxjs6Dependencies
            : rxjs5Dependencies;

        return {
            ...angularDependencies,
            ...rxjsDependencies,
            ...typescriptDependencies
        };

    }

}
