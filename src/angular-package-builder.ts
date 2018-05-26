import { posix as path } from 'path';

import { AngularPackage } from './angular-package';
import { AngularPackageBundler } from './bundler/angular-package.bundler';
import { AngularPackageCompiler } from './compiler/angular-package.compiler';
import { AngularPackageTransformer } from './transformer/angular-package.transformer';
import { AngularPackageComposer } from './composer/angular-package.composer';
import { deleteFolder } from './utilities/delete-folder';
import { AngularPackageLogger } from './logger/angular-package-logger';

/**
 * Angular Package Builder
 */
export class AngularPackageBuilder {

    /**
     * Create Angular Package
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolves when done
     */
    public static async package( angularPackage: AngularPackage ): Promise<void> {

        console.log( '' );
        console.log( `PACKAGE "${ angularPackage.packageName }"` );
        console.log( '' );

        await this.cleanupTemporaryOutputFolder( angularPackage );

        await this.transform( angularPackage );
        await this.compile( angularPackage );
        await this.bundle( angularPackage );
        await this.compose( angularPackage );

        await this.cleanupTemporaryOutputFolder( angularPackage );

        AngularPackageLogger.done();

        console.log( '' );
        console.log( 'DONE.' );
        console.log( '' );

    }

    /**
     * Transform
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolves when done
     */
    private static async transform( angularPackage: AngularPackage ): Promise<void> {
        AngularPackageLogger.log( {
            task: 'Apply transformations',
            progress: 0
        } );
        const angularPackageTransformer: AngularPackageTransformer = new AngularPackageTransformer( angularPackage );
        await angularPackageTransformer.transform();
        AngularPackageLogger.log( {
            progress: 1
        } );
    }

    /**
     * Compile
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolves when done
     */
    private static async compile( angularPackage: AngularPackage ): Promise<void> {

        const angularPackageCompiler: AngularPackageCompiler = new AngularPackageCompiler( angularPackage );

        AngularPackageLogger.log( {
            task: 'Compile ESM2015',
            message: 'Compile TypeScript into ES2015',
            progress: 0
        } );
        await angularPackageCompiler.compile( 'esm2015' );
        AngularPackageLogger.log( {
            progress: 1
        } );

        AngularPackageLogger.log( {
            task: 'Compile ESM5',
            message: 'Compile TypeScript into ES5',
            progress: 0
        } );
        await angularPackageCompiler.compile( 'esm5' );
        AngularPackageLogger.log( {
            progress: 1
        } );

    }

    /**
     * Bundle
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolves when done
     */
    private static async bundle( angularPackage: AngularPackage ): Promise<void> {

        const angularPackageBundler: AngularPackageBundler = new AngularPackageBundler( angularPackage );

        AngularPackageLogger.log( {
            task: 'Bundle FESM2015',
            message: 'Create flat ES2015 bundle',
            progress: 0
        } );
        await angularPackageBundler.bundle( 'fesm2015' );
        AngularPackageLogger.log( {
            progress: 1
        } );

        AngularPackageLogger.log( {
            task: 'Bundle FESM5',
            message: 'Create flat ES5 bundle',
            progress: 0
        } );
        await angularPackageBundler.bundle( 'fesm5' );
        AngularPackageLogger.log( {
            progress: 1
        } );

        AngularPackageLogger.log( {
            task: 'Bundle UMD',
            message: 'Create UMD bundle',
            progress: 0
        } );
        await angularPackageBundler.bundle( 'umd' );
        AngularPackageLogger.log( {
            progress: 1
        } );

    }

    /**
     * Compose
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolves when done
     */
    private static async compose( angularPackage: AngularPackage ): Promise<void> {

        const angularPackageComposer: AngularPackageComposer = new AngularPackageComposer( angularPackage );

        AngularPackageLogger.log( {
            task: 'Compose Package',
            progress: 0
        } );
        await angularPackageComposer.compose();
        AngularPackageLogger.log( {
            progress: 1
        } );

    }

    /**
     * Cleanup the temporary output folder
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolves when done
     */
    private static async cleanupTemporaryOutputFolder( angularPackage: AngularPackage ): Promise<void> {
        await deleteFolder( path.join( angularPackage.root, angularPackage.outDir, 'temp' ) );
	}

}
