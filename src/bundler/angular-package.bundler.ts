import { posix as path } from 'path';

import { AngularPackage } from '../angular-package';
import { RollupConfigurationBuilder } from './rollup-configuration-builder';
import { RollupBundler } from './rollup-bundler';

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

    public async bundle( target: 'fesm2015' | 'fesm5' | 'umd' ): Promise<void> {

        // Collect information
        const entryFileName: string = `${ this.angularPackage.packageName.split( '/' ).pop() }.js`;
        const entryFile: string = target === 'fesm2015'
            ? path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'esm2015', entryFileName )
            : path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'esm5', entryFileName );
        const outDir: string = target === 'umd'
            ? path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'bundles' )
            : path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', target );

        // Build Rollup configuration
        const { inputOptions, outputOptions }: any = new RollupConfigurationBuilder()
            .withEntryFile( entryFile )
            .withDependencies( this.angularPackage.dependencies )
            .withName( this.angularPackage.packageName )
            .toTarget( target )
            .build();

        // Bundle
        await RollupBundler.bundle( inputOptions, outputOptions, outDir );

    }

}
