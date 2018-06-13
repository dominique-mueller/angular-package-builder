import { posix as path } from 'path';

import * as del from 'del';
import { gte } from 'semver';
import { main as angularCompilerCli } from '@angular/compiler-cli/src/main';

import { AngularPackage } from '../angular-package';
import { writeFile } from '../utilities/write-file';
import { TypeScriptConfigurationBuilder } from './typescript-configuration-builder';
import { getInstalledDependencyVersion } from '../utilities/get-installed-dependency-version';
import { copyFiles } from '../utilities/copy-files';
import { AngularPackageLogger } from '../logger/angular-package-logger';

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
        angularCompilerCli( angularCompilerCliArguments, ( error: string ): void => {
            this.handleAngularCompilerCliError( error );
        } );

        // Move build files
        const buildFilesPattern: string = '*.+(js?(.map)|d.ts|json)';
        await copyFiles(
            path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp', 'transformed', '**', buildFilesPattern ),
            path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp', target )
        );
        await del( [
            path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp', 'transformed', '**', buildFilesPattern )
        ] );

    }

    /**
     * Build TypeScript configuration
     *
     * @param   target Build target
     * @returns        Path to the tsconfig file
     */
    private async buildAndWriteTypescriptConfiguration( target: 'esm2015' | 'esm5' ): Promise<string> {

        // Collect information
        const tempDir: string = path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp' );
        const entryDir: string = path.join( tempDir, 'transformed' );
        const outDir: string = path.join( tempDir, 'transformed' ); // Same as entry directory in order to not break sourcemap paths
        const entryFile: string = path.join( tempDir, 'transformed', path.basename( this.angularPackage.entryFile ) );

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
        const tsconfigPath: string = path.join( tempDir, `tsconfig.${ target }.json` );
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
        const angularCompilerCliArguments: any = gte( angularCompilerCliVersion, '5.0.0' )
            ? [ '-p', tsconfigPath ]
            : { p: tsconfigPath };

        return angularCompilerCliArguments;

    }

    /**
     * Handle Angular Compiler CLI error
     *
     * @param error Error message
     */
    private handleAngularCompilerCliError( error: string ): Array<string> {

        // Collect information
        let message: string;
        let details: string;
        switch ( true ) {

            // Error from tsickle
            //
            // Example:
            // transformed/src/input/input.component.ts(50,2): warning TS0: the type annotation on @param is redundant with its TypeScript type, remove the {...} part
            case /(error|warning) TS0/.test( error ):
                message = 'An error occured while optimizing the sources for the Closure Compiler with tsickle.';
                details = this.constructTypescriptErrorDetails( error );
                break;

            // Error from TypeScript
            //
            // Example:
            // transformed/src/input/input.component.ts(56,31): error TS2345: Argument of type 'false' is not assignable to parameter of type 'string'.
            case /(error|warning) TS[0-9]+/.test( error ):
                message = 'An error occured while compiling the sources with the TypeScript Compiler.';
                details = this.constructTypescriptErrorDetails( error );
                break;

            // Error from Angular Compiler
            //
            // Example:
            // Error: C:/Users/DOM/Projekte/angular-package-builder/test/errors/packages/library-error-angular-compiler/dist/temp/transformed/src/library.module.ts:9:1: Error encountered in metadata generated for exported symbol 'LibraryUIModule':
            // C:/Users/DOM/Projekte/angular-package-builder/test/errors/packages/library-error-angular-compiler/dist/temp/transformed/src/library.module.ts:22:25: Metadata collected contains an error that will be reported at runtime: Lambda not supported.
            //  {"__symbolic":"error","message":"Lambda not supported","line":21,"character":24}
            //    at C:\Users\DOM\Projekte\angular-package-builder\packages\compiler-cli\src\metadata\collector.ts:704:17
            //    at Array.forEach (<anonymous>)
            //    at validateMetadata (C:\Users\DOM\Projekte\angular-package-builder\packages\compiler-cli\src\metadata\collector.ts:693:40)
            //    at MetadataCollector.getMetadata (C:\Users\DOM\Projekte\angular-package-builder\packages\compiler-cli\src\metadata\collector.ts:547:9)
            //    at LowerMetadataCache.getMetadataAndRequests (C:\Users\DOM\Projekte\angular-package-builder\packages\compiler-cli\src\transformers\lower_expressions.ts:333:37)
            //    at LowerMetadataCache.ensureMetadataAndRequests (C:\Users\DOM\Projekte\angular-package-builder\packages\compiler-cli\src\transformers\lower_expressions.ts:271:21)
            //    at LowerMetadataCache.getRequests (C:\Users\DOM\Projekte\angular-package-builder\packages\compiler-cli\src\transformers\lower_expressions.ts:265:17)
            //    at C:\Users\DOM\Projekte\angular-package-builder\packages\compiler-cli\src\transformers\lower_expressions.ts:192:34
            //    at C:\Users\DOM\Projekte\angular-package-builder\node_modules\typescript\lib\typescript.js:3025:86
            //    at reduceLeft (C:\Users\DOM\Projekte\angular-package-builder\node_modules\typescript\lib\typescript.js:2697:30)
            case /compiler-cli/.test( error ):
                message = 'An error occured while compiling the sources with the Angular Compiler.';
                details = this.constructAngularCompilerErrorDetails( error );
                break;

            // Fallback
            default:
                message = 'An error occured while compiling the sources.';
                details = error;
                break;

        }

        // Log & re-throw
        const errorMessage: string = [
            message,
            '',
            details,
            '',
            'Tip: For known pitfalls, also see https://github.com/dominique-mueller/angular-package-builder#known-pitfalls-with-solutions'
        ].join( '\n' );
        AngularPackageLogger.logMessage( errorMessage, 'error' );
        throw new Error( errorMessage );

    }

    /**
     * Construct Typescript error details
     *
     * @param   error Error
     * @returns       Error details
     */
    private constructTypescriptErrorDetails( error: string ): string {

        // Get source file
        const sourceFile: string = error
            .split( ':' )[ 0 ] // Cut of unnecessary information
            .replace( /^transformed/, '.' ) // Fix path
            .split( '(' ).join( ' (' ) // Add space between path and line-character information
            .replace( ',', ':' ); // Replace character comma-separator with colon

        // Get error / warning code
        const errorCode: string = error
            .split( ':' )[ 1 ] // Cut of unnecessary information
            .trim(); // Remove whitespaces around

        // Get error message
        const errorMessage: string = error
            .split( ':' )[ 2 ] // Cut of unnecessary information
            .trim() // Remove whitespaces around
            .replace( /\.$/, '' ); // Remove dot at the end

        // Construct details
        return [
            `Source file:  ${ sourceFile }`,
            `Code:         ${ errorCode[ 0 ].toUpperCase() }${ errorCode.slice( 1 ) }`,
            `Message:      ${ errorMessage[ 0 ].toUpperCase() }${ errorMessage.slice( 1 ) }`
        ].join( '\n' );

    }

    /**
     * Construct Angular Compiler error details
     *
     * @param   error Error
     * @returns       Error details
     */
    private constructAngularCompilerErrorDetails( error: string ): string {

        // Cleanup error message and split into lines
        const errorLines: Array<string> = error
            .replace( /^: Error: /, '' ) // Remove leading error
            .split( '\n' ) // Split lines
            .filter( ( errorLine: string ): boolean => { // Filter out stracktrace
                return !errorLine.trim().startsWith( 'at' );
            } )
            .map( ( errorLine: string ): string => { // Align to left
                return errorLine.trim();
            } );

        // Get sorce file
        const basePath: string = path.join( this.angularPackage.root, this.angularPackage.outDir, 'temp', 'transformed' );
        const sourceFile: string = errorLines
            .reverse() // Prefer latest appearance of path
            .find( ( errorLine: string ): boolean => { // Get first line starting with file path
                return new RegExp( `^${ basePath }`, 'g' ).test( errorLine );
            } )
            .split( ' ' )[ 0 ] // Remove unnecessary information
            .replace( new RegExp( basePath, 'g' ), '.' ) // Fix path
            .replace( /:(\d+):(\d+):/, ' ($1:$2)' ); // Fix line-character style

        // Get error messages
        const errorMessages: Array<string> = errorLines
            .reverse() // Revert reverse
            .map( ( errorLine: string ): string => {
                return new RegExp( `^${ basePath }`, 'g' ).test( errorLine )
                    ? errorLine.split( ' ' ).slice( 1 ).join( ' ' )
                    : errorLine;
            } );

        // Get error message (without details object)
        const errorMessage: Array<string> = errorMessages
            .filter( ( errorLine: string ): boolean => { // Filter out details objcet
                return errorLine[ 0 ] !== '{';
            } )
            .filter( ( errorLine: string ): boolean => { // Filter out empty lines
                return errorLine.trim() !== '';
            } )
            .map( ( errorLine: string, index: number ): string => { // Format
                return index === 0
                    ? `Message:      ${ errorLine }`
                    : `              ${ errorLine }`;
            } );

        // Get error details object
        const errorDetails: Array<string> = JSON.stringify(
            JSON.parse(
                errorMessages
                    .find( ( errorLine: string ): boolean => {
                        return errorLine[ 0 ] === '{';
                    } )
            ),
            null,
            '  ' // Indentation
        )
            .split( '\n' )
            .map( ( objectLine: string, index: number ): string => { // Format
                return index === 0
                    ? `Details:      ${ objectLine }`
                    : `              ${ objectLine }`;
            } );

        // Construct details
        return [
            `Source File:  ${ sourceFile }`,
            ...errorMessage,
            ...errorDetails
        ].join( '\n' );

    }

}
