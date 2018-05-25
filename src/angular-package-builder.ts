import { posix as path } from 'path';

import { AngularPackage } from './angular-package';
import { AngularPackageBundler } from './bundler/angular-package.bundler';
import { AngularPackageCompiler } from './compiler/angular-package.compiler';
import { AngularPackageTransformer } from './transformer/angular-package.transformer';
import { AngularPackageComposer } from './composer/angular-package.composer';
import { deleteFolder } from './utilities/delete-folder';

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

        console.log( '  -> Cleanup ...' );
        await this.cleanupTemporaryOutputFolder( angularPackage );

        console.log( '  -> Transform ...' );
        await this.transform( angularPackage );

        console.log( '  -> Compile ...' );
        await this.compile( angularPackage );

        console.log( '  -> Bundle ...' );
        await this.bundle( angularPackage );

        console.log( '  -> Compose ...' );
        await this.compose( angularPackage );

        console.log( '  -> Cleanup ...' );
        await this.cleanupTemporaryOutputFolder( angularPackage );

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
        const angularPackageTransformer: AngularPackageTransformer = new AngularPackageTransformer( angularPackage );
	    await angularPackageTransformer.transform();
    }

    /**
     * Compile
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolves when done
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
     * @returns                Promise, resolves when done
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
     * @returns                Promise, resolves when done
     */
    private static async compose( angularPackage: AngularPackage ): Promise<void> {
        const angularPackageComposer: AngularPackageComposer = new AngularPackageComposer( angularPackage );
        await angularPackageComposer.compose();
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
