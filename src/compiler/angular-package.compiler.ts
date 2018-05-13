import { posix as path } from 'path';

import * as semver from 'semver';
import { main as angularCompilerCli } from '@angular/compiler-cli/src/main';

import { AngularPackage } from '../angular-package';
import { writeFile } from '../utilities/write-file';
import { TypeScriptConfigurationBuilder } from './typescript-configuration-builder';
import { getInstalledDependencyVersion } from '../utilities/get-installed-dependency-version';

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

    /**
     * Compile
     *
     * @param   target Compilation target
     * @returns        Promise, resolves when done
     */
    public async compile( target: 'esm2015' | 'esm5' ): Promise<void> {

        // Create and write TypeScript configuration
        const tsconfig: any = this.buildTypeScriptConfiguration( target );
		const tsconfigPath: string = path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', `tsconfig.${ target }.json` );
		await writeFile( tsconfigPath, tsconfig );

        // Construct angular compiler cli arguments
        const angularCompilerCliVersion: string = await getInstalledDependencyVersion( '@angular/compiler-cli' );
        const angularCompilerCliArguments: any = semver.gte( angularCompilerCliVersion, '5.0.0' )
            ? [ '-p', tsconfigPath ]
            : { p: tsconfigPath };

        // Run the Angular compiler
        angularCompilerCli( angularCompilerCliArguments, ( errorMessage: string ): void => {
            throw new Error( [
                `An error occured while trying to compile the TypeScript sources using the Angular Compiler.`,
                errorMessage
            ].join( '\n' ) );
        } );

    }

    /**
     * Build TypeScript configuration
     *
     * @param   target Build target
     * @returns        TypeScript configuration
     */
    private buildTypeScriptConfiguration( target: 'esm2015' | 'esm5' ): any {

        // Collect information
        const entryDir: string = path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'transformed' );
        const outDir: string = path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', target );
        const entryFiles: Array<string> = [
            path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp', 'transformed', this.angularPackage.entryFile )
        ];

        // Build TypeScript configuration
        return new TypeScriptConfigurationBuilder()
            .withEntryFiles( entryFiles )
            .withEntryDir( entryDir )
            .withOutDir( outDir )
            .withName( this.angularPackage.packageName )
            .toTarget( target )
            .build();

    }

}
