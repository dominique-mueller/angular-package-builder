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
        const tsconfigPath: string = await this.buildAndWriteTypescriptConfiguration( target );

        // Run the Angular compiler
        const angularCompilerCliArguments: any = await this.getAngularCompilerCliArguments( tsconfigPath );
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
    private async buildAndWriteTypescriptConfiguration( target: 'esm2015' | 'esm5' ): Promise<string> {

        // Collect information
        const baseDir: string = path.join( this.angularPackage.cwd, this.angularPackage.outDir, 'temp' );
        const entryDir: string = path.join( baseDir, 'transformed' );
        const outDir: string = path.join( baseDir, target );
        const entryFile: string = path.join( baseDir, 'transformed', path.basename( this.angularPackage.entryFile ) );

        // Build TypeScript configuration
        const tsconfig: any = new TypeScriptConfigurationBuilder()
            .setEntry( entryFile, entryDir )
            .setOutDir( outDir )
            .setPackageName( this.angularPackage.packageName )
            .setCompilationTarget( target )
            .setCustomTypescriptCompilerOptions( this.angularPackage.typescriptCompilerOptions )
            .setCustomAngularCompilerOptions( this.angularPackage.angularCompilerOptions )
            .build();

        // Write TypeScript configuration file to disk
        const tsconfigPath: string = path.join( baseDir, `tsconfig.${ target }.json` );
        await writeFile( tsconfigPath, tsconfig );

        return tsconfigPath;

    }

    /**
     * Get Angular Compiler CLI arguments
     *
     * @param   tsconfigPath Path to tsconfig file
     * @returns              Angular Compiller CLI arguments
     */
    private async getAngularCompilerCliArguments( tsconfigPath: string ): Promise<any> {

        // Get the installed angular compiler CLI version
        const angularCompilerCliVersion: string = await getInstalledDependencyVersion( '@angular/compiler-cli' );

        // Construct angular compiler cli argument
        const angularCompilerCliArguments: any = semver.gte( angularCompilerCliVersion, '5.0.0' )
            ? [ '-p', tsconfigPath ]
            : { p: tsconfigPath };

        return angularCompilerCliArguments;

    }

}
