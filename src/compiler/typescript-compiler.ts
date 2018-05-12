import { posix as path } from 'path';

import * as semver from 'semver';
import { main as angularCompilerCli } from '@angular/compiler-cli/src/main';

import { getInstalledDependencyVersion } from '../utilities/get-installed-dependency-version';

/**
 * TypeScript Compiler
 */
export class TypeScriptCompiler {

    /**
     * Compile
     *
     * @param tsconfigPath Paht to the tsconfig files
     */
    public static async compile( tsconfigPath: string ): Promise<void> {

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

}
