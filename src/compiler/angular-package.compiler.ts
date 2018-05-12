import { posix as path } from 'path';

import { AngularPackage } from '../angular-package';
import { TypeScriptCompiler } from './typescript-compiler';
import { writeFile } from '../utilities/write-file';
import { TypeScriptConfigurationBuilder } from './typescript-configuration-builder';

/**
 * Angular Package Compiler
 */
export class AngularPackageCompiler {

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

    public async compile( target: 'esm2015' | 'esm5' ): Promise<void> {

        // Collect information
        const entryDir: string = path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'transformed' );
        const outDir: string = path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', target );
        const entryFiles: Array<string> = [
            path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'transformed', this.angularPackage.entryFile )
        ];

        // Build TypeScript configuration
        const tsconfig: any = new TypeScriptConfigurationBuilder()
            .withEntryFiles( entryFiles )
            .withEntryDir( entryDir )
            .withOutDir( outDir )
            .withName( this.angularPackage.packageName )
            .toTarget( target )
            .build();

        // Save TypeScript configuration to file
		const tsconfigPath: string = path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', `tsconfig.${ target }.json` );
		await writeFile( tsconfigPath, tsconfig );

        // Compile
        await TypeScriptCompiler.compile( tsconfigPath );

    }

}
