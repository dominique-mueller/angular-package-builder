import * as path from 'path';

import { AngularPackage } from './angular-package';
import { AngularPackageBundler } from './bundler/angular-package.bundler';
import { AngularPackageCompiler } from './compiler/angular-package.compiler';
import { AngularPackageTransformer } from './transformer/angular-package.transformer';
import { copyFiles } from './utilities/copy-files';
import { deleteFolder } from './utilities/delete-folder';

/**
 * Angular Package Builder
 */
export class AngularPackageBuilder {

    /**
     * Create Angular Package
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolved when done
     */
    public static async package( angularPackage ): Promise<void> {

        console.log( 'PACKAGE ...' );

        await this.transform( angularPackage );
        await this.compile( angularPackage );
        await this.bundle( angularPackage );
        await this.compose( angularPackage );

        // TODO: Create / update package.json files
        // Needed: isPrimary / isSecondary flag to differenciate between creation / update
        // Needed: The saved package.json file, or at least the path (probably better)

        console.log( 'DONE.' );

    }

    /**
     * Transform
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolved when done
     */
    private static async transform( angularPackage: AngularPackage ): Promise<void> {
        const angularPackageTransformer: AngularPackageTransformer = new AngularPackageTransformer( angularPackage );
	    await angularPackageTransformer.transform();
    }

    /**
     * Compile
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolved when done
     */
    private static async compile( angularPackage: AngularPackage ): Promise<void> {
        const angularPackageCompiler: AngularPackageCompiler = new AngularPackageCompiler( angularPackage );
        await angularPackageCompiler.compile( 'esm2015' );
        await angularPackageCompiler.compile( 'esm5' );
    }

    /**
     * Bundle
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolved when done
     */
    private static async bundle( angularPackage: AngularPackage ): Promise<void> {
        const angularPackageBundler: AngularPackageBundler = new AngularPackageBundler( angularPackage );
        await angularPackageBundler.bundle( 'fesm2015' );
        await angularPackageBundler.bundle( 'fesm5' );
        await angularPackageBundler.bundle( 'umd' );
    }

    /**
     * Compose
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolved when done
     */
    private static async compose( angularPackage: AngularPackage ): Promise<void> {

        // Copy files
        await Promise.all( [

            // Builds
            copyFiles(
                path.join( angularPackage.cwd, angularPackage.outDir, 'temp', 'esm2015', '**', '*.js?(.map)' ),
                path.join( angularPackage.cwd, angularPackage.outDir, 'esm2015' )
            ),
            copyFiles(
                path.join( angularPackage.cwd, angularPackage.outDir, 'temp', 'esm5', '**', '*.js?(.map)' ),
                path.join( angularPackage.cwd, angularPackage.outDir, 'esm5' )
            ),

            // Bundles
            copyFiles(
                path.join( angularPackage.cwd, angularPackage.outDir, 'temp', 'fesm2015', '**', '*.js?(.map)' ),
                path.join( angularPackage.cwd, angularPackage.outDir, 'fesm2015' )
            ),
            copyFiles(
                path.join( angularPackage.cwd, angularPackage.outDir, 'temp', 'fesm5', '**', '*.js?(.map)' ),
                path.join( angularPackage.cwd, angularPackage.outDir, 'fesm5' )
            ),
            copyFiles(
                path.join( angularPackage.cwd, angularPackage.outDir, 'temp', 'bundles', '**', '*.js?(.map)' ),
                path.join( angularPackage.cwd, angularPackage.outDir, 'bundles' )
            ),

            // Typings
            copyFiles(
                path.join( angularPackage.cwd, angularPackage.outDir, 'temp', 'esm2015', '**', '*.d.ts' ),
                path.join( angularPackage.cwd, angularPackage.outDir )
            ),

            // Angular metadata
            copyFiles(
                path.join( angularPackage.cwd, angularPackage.outDir, 'temp', 'esm2015', '**', '*.metadata.json' ),
                path.join( angularPackage.cwd, angularPackage.outDir )
            ),

        ] );

        // Delete temporary folder
        await deleteFolder( path.join( angularPackage.cwd, angularPackage.outDir, 'temp' ) );

    }

}
