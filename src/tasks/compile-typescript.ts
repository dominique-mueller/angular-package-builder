import * as path from 'path';

import { ParsedConfiguration } from '@angular/compiler-cli';

import { AngularPackageBuilderInternalConfig } from './../interfaces/angular-package-builder-internal-config.interface';
import { dynamicImport } from './../utilities/dynamic-import';
import { getTypescriptConfig } from './../config/typescript.config';
import { MemoryFileSystem } from './../memory-file-system/memory-file-system';
import { resolvePath } from './../utilities/resolve-path';
import { TypescriptConfig } from './../config/typescript.config.interface';

/**
 * Compile TypeScript into JavaScript
 */
export function compileTypescript( config: AngularPackageBuilderInternalConfig, memoryFileSystem: MemoryFileSystem | null, target: 'ES2015' | 'ES5' ): Promise<void> {
	return new Promise<void>( async( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Import
		const { readConfiguration, performCompilation } = ( await dynamicImport( '@angular/compiler-cli', memoryFileSystem ) );
		const getFiles = ( await dynamicImport( './../utilities/get-files', memoryFileSystem ) ).getFiles;
		const writeFile = ( await dynamicImport( './../utilities/write-file', memoryFileSystem ) ).writeFile;

		// Get information upfront
		const destinationPath: string = target === 'ES2015' ? config.temporary.buildES2015 : config.temporary.buildES5;

		// Get additional TypeScript definition files
		const typeDefinitionFilesPatterns: Array<string> = [
			path.join( '**', '*.d.ts' ),
			...config.ignored
		]
		const typescriptDefinitionsFiles: Array<string> = await getFiles( typeDefinitionFilesPatterns, config.temporary.prepared, true );

		// Create TypeScript configuration and write to disk
		const entryFiles: Array<string> = [
			path.join( config.temporary.prepared, config.entry.file ), // Only one entry file is allowed!
			...typescriptDefinitionsFiles // Additional TypeScript definition files (not counting as entry file)
		];
		const typescriptConfig: TypescriptConfig = getTypescriptConfig(
			target,
			config.temporary.prepared,
			destinationPath,
			config.packageName,
			entryFiles,
			config.compilerOptions
		);
		const typescriptConfigPath: string = path.join( config.temporary.folder, `tsconfig.${ target }.json` );
		await writeFile( typescriptConfigPath, JSON.stringify( typescriptConfig ) );

		// Run Angular compiler
		const compilerConfig: ParsedConfiguration = readConfiguration( typescriptConfigPath );
		const { diagnostics, program } = performCompilation( compilerConfig );

		resolve();

	} );
}
