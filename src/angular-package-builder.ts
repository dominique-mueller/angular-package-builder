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

        await this.cleanupTemporaryOutputFolder( angularPackage );

        await this.transform( angularPackage );
        await this.compile( angularPackage );
        await this.bundle( angularPackage );
        await this.compose( angularPackage );

        await this.cleanupTemporaryOutputFolder( angularPackage );

    }

    /**
     * Transform
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolves when done
     */
    private static async transform( angularPackage: AngularPackage ): Promise<void> {

        const angularPackageTransformer: AngularPackageTransformer = new AngularPackageTransformer( angularPackage );

        AngularPackageLogger.logTaskStart( 'Apply transformations' );
        await angularPackageTransformer.transform();
        AngularPackageLogger.logTaskSuccess();

    }

    /**
     * Compile
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolves when done
     */
    private static async compile( angularPackage: AngularPackage ): Promise<void> {

        const angularPackageCompiler: AngularPackageCompiler = new AngularPackageCompiler( angularPackage );

        AngularPackageLogger.logTaskStart( 'Compile TypeScript to ES2015' );
        await angularPackageCompiler.compile( 'esm2015' );
        AngularPackageLogger.logTaskSuccess();

        AngularPackageLogger.logTaskStart( 'Compile TypeScript to ES5' );
        await angularPackageCompiler.compile( 'esm5' );
        AngularPackageLogger.logTaskSuccess();

    }

    /**
     * Bundle
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolves when done
     */
    private static async bundle( angularPackage: AngularPackage ): Promise<void> {

        const angularPackageBundler: AngularPackageBundler = new AngularPackageBundler( angularPackage );

        AngularPackageLogger.logTaskStart( 'Generate flat ES2015 bundle' );
        await angularPackageBundler.bundle( 'fesm2015' );
        AngularPackageLogger.logTaskSuccess();

        AngularPackageLogger.logTaskStart( 'Generate flat ES5 bundle' );
        await angularPackageBundler.bundle( 'fesm5' );
        AngularPackageLogger.logTaskSuccess();

        AngularPackageLogger.logTaskStart( 'Generate UMD bundle' );
        await angularPackageBundler.bundle( 'umd' );
        AngularPackageLogger.logTaskSuccess();

    }

    /**
     * Compose
     *
     * @param   angularPackage Angular Package
     * @returns                Promise, resolves when done
     */
    private static async compose( angularPackage: AngularPackage ): Promise<void> {

        const angularPackageComposer: AngularPackageComposer = new AngularPackageComposer( angularPackage );

        AngularPackageLogger.logTaskStart( 'Compose package' );
        await angularPackageComposer.compose();
        AngularPackageLogger.logTaskSuccess();

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
